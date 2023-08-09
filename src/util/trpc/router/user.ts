import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
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
    invalidateApiToken: t.procedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const token = await prisma.apiToken.findFirst({
          where: {
            userId: ctx.session.id,
            id: input,
          },
        });
        if (!token) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        await prisma.apiToken.delete({ where: { id: input } });
        return token;
      }),
    getTimePresets: t.procedure.query(async ({ ctx }) => {
      return await prisma.timePreset.findMany({
        where: {
          userId: ctx.session.id,
        },
      });
    }),
    addTimePreset: t.procedure
      .input(z.number().min(0).max(86400))
      .mutation(async ({ input, ctx }) => {
        return (
          await prisma.user.update({
            where: {
              id: ctx.session.id,
            },
            data: {
              timePresets: {
                create: {
                  time: input,
                },
              },
            },
            include: {
              timePresets: true,
            },
          })
        ).timePresets;
      }),
    removeTimePreset: t.procedure
      .input(z.number().nonnegative())
      .mutation(async ({ input, ctx }) => {
        return (
          await prisma.user.update({
            where: {
              id: ctx.session.id,
            },
            data: {
              timePresets: {
                delete: {
                  id: input,
                },
              },
            },
            include: {
              timePresets: true,
            },
          })
        ).timePresets;
      }),
  });
