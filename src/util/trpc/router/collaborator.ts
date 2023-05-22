import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const collaboratorsRouter = (t: MyTrpc) =>
  t.router({
    list: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
      const list = await prisma.collaborator.findMany({
        where: {
          projectId: input,
          Project: {
            OR: [
              {
                ownerId: ctx.session.id,
              },
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
          user: true,
        },
      });
      if (!list) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return list;
    }),
    listInvitations: t.procedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const list = await prisma.invitation.findMany({
          where: {
            projectId: input,
          },
          select: {
            id: true,
            createdAt: true,
            to: {
              select: {
                email: true,
                name: true,
                image: true,
              },
            },
            from: {
              select: {
                email: true,
                name: true,
                image: true,
              },
            },
          },
        });
        if (!list) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return list;
      }),
    invite: t.procedure
      .input(z.object({ email: z.string().email(), projectId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const otherUser = await prisma.user.findFirst({
          where: {
            email: input.email,
          },
          include: {
            incomingInvitations: true,
          },
        });
        if (!otherUser) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (
          otherUser.incomingInvitations.some(
            (it) => it.projectId === input.projectId
          )
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ALREADY_INVITED",
          });
        }
        await prisma.invitation.create({
          data: {
            senderId: ctx.session.id,
            receiverId: otherUser.id,
            projectId: input.projectId,
          },
        });
      }),
    remove: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
      // Only the owner can remove other collaborators
      const invitation = await prisma.invitation.findFirst({
        where: {
          id: input,
          project: {
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                collaborators: {
                  some: {
                    id: input,
                    userId: ctx.session.id,
                  },
                },
              },
            ],
          },
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
