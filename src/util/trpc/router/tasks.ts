import { prisma } from "@/util/prisma";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const tasksRouter = (t: MyTrpc) =>
  t.router({
    create: t.procedure
      .input(
        z.object({
          sectionId: z.number(),
          name: z.string(),
          description: z.optional(z.string()),
          dueDate: z.nullable(z.date()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const section = await prisma.section.findFirst({
          where: {
            id: input.sectionId,
            project: {
              OR: [
                {
                  ownerId: ctx.session.id,
                },
                {
                  collaborators: {
                    some: { userId: ctx.session.id, role: Role.EDITOR },
                  },
                },
              ],
            },
          },
        });

        if (!section) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await prisma.section.update({
          where: {
            id: input.sectionId,
          },
          data: {
            tasks: {
              create: {
                name: input.name,
                description: input.description ?? "",
                ownerId: ctx.session.id,
                dueDate: input.dueDate,
                projectId: section.projectId,
              },
            },
          },
        });
      }),
    delete: t.procedure.input(z.number()).mutation(async ({ ctx, input }) => {
      await deleteTask(input, ctx.session.id);
    }),
    update: t.procedure
      .input(
        z
          .object({
            name: z.string(),
            description: z.string(),
            // labels: z.array(z.string()),
            priority: z.number(),
            createdAt: z.date(),
            completed: z.boolean(),
            startDate: z.date(),
            dueDate: z.date(),
          })
          .partial()
          .extend({
            id: z.number(),
          })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            OR: [
              {
                project: {
                  ownerId: ctx.session.id,
                },
              },
              {
                project: {
                  collaborators: {
                    some: { userId: ctx.session.id, role: Role.EDITOR },
                  },
                },
              },
            ],
          },
        });

        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return await prisma.task.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            priority: input.priority,
            createdAt: input.createdAt,
            updatedAt: new Date(),
            completed: input.completed,
            startDate: input.startDate ?? null,
            dueDate: input.dueDate ?? null,
          },
        });
      }),
    addSubtask: t.procedure
      .input(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          dueDate: z.nullable(z.date()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                project: {
                  collaborators: {
                    some: { userId: ctx.session.id, role: Role.EDITOR },
                  },
                },
              },
            ],
          },
        });
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        await prisma.task.update({
          where: {
            id: input.id,
          },
          data: {
            subTasks: {
              create: [
                {
                  name: input.name,
                  description: input.description,
                  ownerId: ctx.session.id,
                  dueDate: input.dueDate,
                  projectId: task.projectId,
                },
              ],
            },
          },
          select: null,
        });
      }),
    get: t.procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                project: {
                  collaborators: {
                    some: {
                      userId: ctx.session.id,
                    },
                  },
                },
              },
            ],
          },
          include: {
            parentTask: true,
            subTasks: true,
          },
        });
        if (task === null) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return task;
      }),
    /**
     * Get a list of every top-level task that the user currently has. Does not include sub-tasks.
     */
    listTopLevel: t.procedure.query(async ({ ctx }) => {
      return await prisma.task.findMany({
        where: {
          AND: {
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                project: {
                  collaborators: { some: { userId: ctx.session.id } },
                },
              },
            ],
            parentTaskId: null,
          },
        },
        include: {
          section: {
            select: {
              projectId: true,
            },
          },
        },
      });
    }),
  });

/**
 * Deletes a task, removing any reminders and sub-tasks in the process.
 */
export async function deleteTask(
  id: number,
  ownerId: string,
  depth: number = 0
) {
  if (depth > 8) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Nested tasks are too deep to remove!",
    });
  }
  await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id,
        ownerId,
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
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    await tx.reminder.deleteMany({
      where: {
        taskId: id,
      },
    });

    await Promise.all(
      task.subTasks.map((subTask) => deleteTask(subTask.id, ownerId, depth + 1))
    );

    return await tx.task.delete({
      where: {
        id,
      },
    });
  });
}
