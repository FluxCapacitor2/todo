import { prisma } from "@/util/prisma";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const userRouter = (t: MyTrpc) =>
  t.router({
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
  });
