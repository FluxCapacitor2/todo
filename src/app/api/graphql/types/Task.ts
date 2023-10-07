import { Role } from "@prisma/client";
import { prisma } from "../../../../../src/util/prisma";
import { builder } from "../builder";

builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
    priority: t.exposeInt("priority"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    completed: t.exposeBoolean("completed"),
    startDate: t.expose("startDate", { type: "DateTime", nullable: true }),
    dueDate: t.expose("dueDate", { type: "DateTime", nullable: true }),
    sectionId: t.exposeInt("sectionId", { nullable: true }),
    parentTaskId: t.exposeInt("parentTaskId", { nullable: true }),
    ownerId: t.exposeString("ownerId"),
    owner: t.relation("owner"),
    parentTask: t.relation("parentTask", { nullable: true }),
    subTasks: t.relation("subTasks"),
    section: t.relation("section"),
    labels: t.relation("labels"),
    reminders: t.relation("reminders"),
    project: t.relation("project"),
    projectId: t.exposeString("projectId"),
    subtaskCounts: t.string({
      // TODO: this is a huge N+1 problem
      resolve: async (parent, args, ctx, info) => {
        const results = await prisma.task.findMany({
          where: {
            parentTaskId: parent.id,
          },
          include: {
            subTasks: {
              select: {
                completed: true,
              },
            },
          },
        });
        const completed = results.reduce(
          (acc, it) => (it.completed ? acc + 1 : acc),
          0
        );
        return `${completed}/${results.length}`;
      },
    }),
  }),
});

builder.mutationField("updateTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      id: t.arg.int(),
    },
    resolve: async (query, _parent, args, ctx, _info) => {
      return await prisma.task.update({
        where: {
          id: args.id!,
          project: {
            OR: [
              {
                ownerId: ctx.userId,
              },
              { collaborators: { some: { userId: ctx.userId } } },
            ],
          },
        },
        data: {
          // TODO updates
        },
      });
    },
  })
);

builder.mutationField("createTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      sectionId: t.arg.int(),
      name: t.arg.string(),
      description: t.arg.string(),
      dueDate: t.arg({ type: "DateTime" }),
    },
    resolve: async (query, _parent, args, ctx, _info) => {
      const section = await prisma.section.findFirst({
        where: {
          id: args.sectionId!,
          project: {
            OR: [
              {
                ownerId: ctx.userId,
              },
              {
                collaborators: {
                  some: { userId: ctx.userId, role: Role.EDITOR },
                },
              },
            ],
          },
        },
      });

      if (!section) {
        throw new Error("Section not found");
      }

      return await prisma.task.create({
        data: {
          sectionId: args.sectionId!,
          name: args.name!,
          description: args.description ?? "",
          ownerId: ctx.userId,
          dueDate: args.dueDate,
          projectId: section.projectId,
        },
      });
    },
  })
);

builder.mutationField("deleteTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      id: t.arg.int(),
    },
    resolve: async (query, _parent, args, ctx, _info) => {
      const task = await prisma.task.findFirst({
        where: { id: args.id! },
        select: { project: { select: { archived: true } } },
      });

      if (!task) {
        throw new Error("Task not found");
      } else if (task.project.archived) {
        throw new Error("Project is archived");
      }

      return await deleteTask(args.id!, ctx.userId);
    },
  })
);

builder.mutationField("createSubTask", (t) =>
  t.prismaField({
    type: "Task",
    args: {
      parentTaskId: t.arg.int(),
      name: t.arg.string(),
      description: t.arg.string(),
      dueDate: t.arg({ type: "DateTime" }),
    },
    resolve: async (query, _parent, args, ctx, _info) => {
      const task = await prisma.task.findFirst({
        where: {
          id: args.parentTaskId!,
          OR: [
            {
              ownerId: ctx.userId,
            },
            {
              project: {
                collaborators: {
                  some: { userId: ctx.userId, role: Role.EDITOR },
                },
              },
            },
          ],
        },
        include: {
          project: {
            select: {
              archived: true,
            },
          },
          section: {
            select: {
              archived: true,
            },
          },
        },
      });
      if (!task) {
        throw new Error("Task not found");
      }

      if (task.project.archived || task.section?.archived) {
        throw new Error("Project or section is archived");
      }

      return await prisma.task.create({
        data: {
          name: args.name!,
          description: args.description ?? "",
          ownerId: ctx.userId,
          dueDate: args.dueDate,
          projectId: task.projectId,
          parentTaskId: args.parentTaskId!,
        },
      });
    },
  })
);

/**
 * Deletes a task, removing any reminders and sub-tasks in the process.
 */
export async function deleteTask(
  id: number,
  userId: string,
  depth: number = 0
) {
  if (depth > 8) {
    throw new Error("Nested tasks are too deep to remove!");
  }
  return await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            project: {
              collaborators: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        subTasks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await tx.reminder.deleteMany({
      where: {
        taskId: id,
      },
    });

    await Promise.all(
      task.subTasks.map((subTask) => deleteTask(subTask.id, userId, depth + 1))
    );

    return await tx.task.delete({
      where: {
        id,
      },
    });
  });
}
