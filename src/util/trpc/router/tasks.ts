import { prisma } from "@/util/prisma";
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
              ownerId: ctx.session.id,
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
            ownerId: ctx.session.id,
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
            ownerId: ctx.session.id,
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
            ownerId: ctx.session.id,
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
  });

/**
 * Deletes a task, removing any reminders in the process.
 */
export async function deleteTask(id: number, ownerId: string) {
  await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id,
        ownerId,
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

    return await tx.task.delete({
      where: {
        id,
      },
    });
  });
}
