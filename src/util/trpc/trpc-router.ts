import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import { projectsRouter } from "./router/project";
import { sectionsRouter } from "./router/sections";
import { tasksRouter } from "./router/tasks";
import { z } from "zod";
import { prisma } from "../prisma";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export type MyTrpc = typeof t;

export const appRouter = t.router({
  projects: projectsRouter(t),
  sections: sectionsRouter(t),
  tasks: tasksRouter(t),
  user: t.router({
    addToken: t.procedure.input(z.string()).mutation(async ({ input, ctx }) => {
      const res = await prisma.user.update({
        where: {
          id: ctx.session.id,
        },
        data: {
          notificationTokens: {
            upsert: {
              create: {
                token: input,
              },
              update: {},
              where: {
                token: input,
              },
            },
          },
        },
      });
    }),
    removeToken: t.procedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const res = await prisma.user.update({
          where: {
            id: ctx.session.id,
          },
          data: {
            notificationTokens: {
              delete: {
                token: input,
              },
            },
          },
        });
      }),
    getTokens: t.procedure.query(async ({ input, ctx }) => {
      return (
        await prisma.user.findFirst({
          where: {
            id: ctx.session.id,
          },
          select: {
            notificationTokens: true,
          },
        })
      )?.notificationTokens;
    }),
  }),
});

export type AppRouter = typeof appRouter;
