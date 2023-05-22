import { prisma } from "@/util/prisma";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const invitationRouter = (t: MyTrpc) =>
  t.router({
    listIncoming: t.procedure.query(async ({ ctx }) => {
      return await prisma.invitation.findMany({
        where: {
          receiverId: ctx.session.id,
        },
        include: {
          from: true,
          project: true,
        },
      });
    }),
    listOutgoing: t.procedure.query(async ({ ctx }) => {
      return await prisma.invitation.findMany({
        where: {
          senderId: ctx.session.id,
        },
        include: {
          to: true,
          project: true,
        },
      });
    }),
    accept: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
      await prisma.$transaction(async (tx) => {
        const invitation = await tx.invitation.delete({
          where: { id: input },
        });
        if (invitation.receiverId !== ctx.session.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        await tx.project.update({
          where: {
            id: invitation.projectId,
          },
          data: {
            collaborators: {
              create: {
                role: Role.EDITOR, //todo roles
                userId: ctx.session.id,
              },
            },
          },
        });
      });
    }),
    rescind: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
      const invitation = await prisma.invitation.findFirst({
        where: {
          senderId: ctx.session.id,
          id: input,
        },
      });
      if (!invitation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });
    }),
  });
