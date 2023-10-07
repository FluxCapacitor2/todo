import { Role } from "@prisma/client";
import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";
import { deleteTask } from "./Task";

builder.prismaObject("Section", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    tasks: t.relation("tasks", { query: { where: { completed: false } } }),
    projectId: t.exposeString("projectId"),
    project: t.relation("project"),
    archived: t.exposeBoolean("archived"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

builder.mutationField("updateSection", (t) =>
  t.prismaField({
    type: "Section",
    args: {
      id: t.arg.int(),
      name: t.arg.string({ required: false }),
      archived: t.arg.boolean({ required: false }),
    },
    resolve: async (fields, _, args, context, info) => {
      const section = await prisma.section.findFirstOrThrow({
        where: {
          id: args.id!,
          project: {
            OR: [
              { ownerId: context.userId },
              {
                collaborators: {
                  some: { userId: context.userId, role: Role.EDITOR },
                },
              },
            ],
          },
        },
      });

      return await prisma.section.update({
        where: { id: section.id },
        data: {
          ...(!!args.name ? { name: args.name } : {}),
          ...(args.archived !== null && args.archived !== undefined
            ? { archived: args.archived }
            : {}),
        },
      });
    },
  })
);

builder.mutationField("createSection", (t) =>
  t.prismaField({
    type: "Section",
    args: {
      projectId: t.arg.string(),
    },
    resolve: async (fields, _, args, context, info) => {
      const project = await prisma.project.findFirst({
        where: {
          OR: [
            {
              ownerId: context.userId,
            },
            {
              collaborators: {
                some: { userId: context.userId, role: Role.EDITOR },
              },
            },
          ],
          id: args.projectId!,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return await prisma.section.create({
        data: {
          projectId: project.id,
          name: "New Section",
        },
      });
    },
  })
);

builder.mutationField("deleteSection", (t) =>
  t.prismaField({
    type: "Section",
    args: {
      id: t.arg.int(),
    },
    resolve: async (fields, _, args, context, info) => {
      return await deleteSection(args.id!, context.userId);
    },
  })
);

/**
 * Deletes a section, removing any tasks/sub-tasks in the process.
 */
export async function deleteSection(id: number, userId: string) {
  const section = await prisma.section.findFirst({
    where: {
      id,
      project: {
        OR: [
          {
            ownerId: userId,
          },
          {
            collaborators: {
              some: {
                userId: userId,
                role: Role.EDITOR,
              },
            },
          },
        ],
      },
    },
    include: {
      tasks: {
        include: {
          reminders: true,
          subTasks: true,
        },
      },
    },
  });

  for (const task of section?.tasks ?? []) {
    if (task.subTasks.length > 0 || task.reminders.length > 0) {
      await deleteTask(task.id, userId);
    }
  }

  if (!section) {
    throw new Error("Section not found!");
  }

  return await prisma.section.delete({
    where: {
      id,
    },
  });
}
