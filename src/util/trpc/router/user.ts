import { prisma } from "@/util/prisma";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const userRouter = (t: MyTrpc) =>
  t.router({
    addNotifToken: t.procedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        await prisma.user.update({
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
    removeNotifToken: t.procedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        await prisma.user.update({
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
    getNotifTokens: t.procedure.query(async ({ input, ctx }) => {
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
    getApiToken: t.procedure.query(async ({ input, ctx }) => {
      const token = await prisma.apiToken.findFirst({
        where: {
          userId: ctx.session.id,
        },
      });
      if (!token) {
        return await prisma.apiToken.create({
          data: {
            userId: ctx.session.id,
          },
        });
      }
      return token;
    }),
  });
