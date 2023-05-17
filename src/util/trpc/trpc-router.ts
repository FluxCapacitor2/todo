import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { prisma } from "../prisma";
import { Context } from "./context";
import { projectsRouter } from "./router/project";
import { sectionsRouter } from "./router/sections";
import { tasksRouter } from "./router/tasks";
import { userRouter } from "./router/user";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export type MyTrpc = typeof t;

export const appRouter = t.router({
  projects: projectsRouter(t),
  sections: sectionsRouter(t),
  tasks: tasksRouter(t),
  user: userRouter(t),
  notification: t.router({
    list: t.procedure.input(z.number()).query(async ({ ctx, input }) => {
      return await prisma.reminder.findMany({
        where: {
          AND: {
            taskId: input,
            Task: {
              ownerId: ctx.session.id,
            },
          },
        },
      });
    }),
    add: t.procedure
      .input(
        z.object({
          taskId: z.number(),
          time: z.date().min(new Date()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.taskId,
          },
          include: {
            _count: {
              select: {
                reminders: true,
              },
            },
          },
        });

        if (task?.ownerId !== ctx.session.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
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
            Task: {
              ownerId: ctx.session.id,
            },
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
  }),
});

export type AppRouter = typeof appRouter;
