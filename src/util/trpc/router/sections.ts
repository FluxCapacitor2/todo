import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const sectionsRouter = (t: MyTrpc) =>
  t.router({
    create: t.procedure
      .input(z.object({ name: z.string(), projectId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const project = await prisma.project.findFirst({
          where: {
            ownerId: ctx.session.id,
            id: input.projectId,
          },
        });

        if (!project) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await prisma.project.update({
          where: {
            id: input.projectId,
          },
          data: {
            sections: {
              create: {
                name: "New Section",
              },
            },
          },
        });
      }),
    delete: t.procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const section = await prisma.section.findFirst({
          where: {
            id: input.id,
            project: {
              ownerId: ctx.session.id,
            },
          },
        });

        if (!section) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await prisma.section.delete({
          where: {
            id: input.id,
          },
        });
      }),
    update: t.procedure
      .input(z.object({ id: z.number(), name: z.optional(z.string()) }))
      .mutation(async ({ ctx, input }) => {
        const section = await prisma.section.findFirst({
          where: {
            id: input.id,
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
            id: input.id,
          },
          data: {
            name: input.name,
          },
        });
      }),
  });
