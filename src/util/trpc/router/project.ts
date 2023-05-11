import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";

export const projectsRouter = (t: MyTrpc) =>
  t.router({
    list: t.procedure.query(async ({ ctx }) => {
      return await prisma.project.findMany({
        where: {
          ownerId: ctx.session.id,
        },
      });
    }),
    get: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
      return await prisma.project.findFirst({
        where: {
          ownerId: ctx.session.id,
          id: input,
        },
        include: {
          sections: {
            include: {
              tasks: true,
            },
          },
        },
      });
    }),
    create: t.procedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await prisma.project.create({
          data: {
            name: input.name,
            ownerId: ctx.session.id,
            sections: {
              create: [
                {
                  name: "New Section",
                },
              ],
            },
          },
        });
      }),
    delete: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input,
          ownerId: ctx.session.id,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),
  });
