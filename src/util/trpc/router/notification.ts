import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const notificationRouter = (t: MyTrpc) =>
  t.router({
    listAll: t.procedure.query(async ({ ctx }) => {
      return await prisma.reminder.findMany({
        orderBy: {
          time: "asc",
        },
        where: {
          userId: ctx.session.id,
          time: {
            // Only return notifications in the next 24 hours
            lte: new Date(new Date().getTime() + 86_400_000),
          },
        },
        include: {
          Task: {
            select: {
              name: true,
              dueDate: true,
              completed: true,
            },
          },
        },
        take: 50,
      });
    }),
    list: t.procedure.input(z.number()).query(async ({ ctx, input }) => {
      return await prisma.reminder.findMany({
        where: {
          taskId: input,
          userId: ctx.session.id,
        },
      });
    }),
    add: t.procedure
      .input(
        z.object({
          taskId: z.number(),
          projectId: z.string(),
          time: z.date().min(new Date()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.taskId,
            project: {
              OR: [
                { ownerId: ctx.session.id },
                {
                  collaborators: {
                    some: {
                      userId: ctx.session.id,
                    },
                  },
                },
              ],
            },
          },
          include: {
            _count: {
              select: {
                reminders: true,
              },
            },
          },
        });

        if (!task) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        if (task._count.reminders >= 10) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have too many reminders for this task!",
          });
        }

        await prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            reminders: {
              create: {
                time: input.time,
                projectId: input.projectId,
                userId: ctx.session.id,
              },
            },
          },
        });
      }),
    remove: t.procedure.input(z.number()).mutation(async ({ ctx, input }) => {
      const reminder = await prisma.reminder.findFirst({
        where: {
          AND: {
            id: input,
            userId: ctx.session.id,
          },
        },
      });

      if (reminder === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.reminder.delete({
        where: {
          id: input,
        },
      });
    }),
  });
