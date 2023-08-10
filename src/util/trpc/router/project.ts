import { prisma } from "@/util/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";
import { collaboratorsRouter } from "./collaborator";

export const projectsRouter = (t: MyTrpc) =>
  t.router({
    collaborators: collaboratorsRouter(t),
    list: t.procedure.query(async ({ ctx }) => {
      return await prisma.project.findMany({
        where: {
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
      });
    }),
    get: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
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
          id: input,
        },
        include: {
          sections: {
            where: {
              archived: false,
            },
            include: {
              tasks: {
                where: {
                  completed: false,
                },
                include: {
                  subTasks: {
                    select: {
                      completed: true,
                    },
                  },
                },
              },
            },
          },
          owner: true,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return project;
    }),
    create: t.procedure
      .input(z.object({ name: z.string().nonempty().max(100) }))
      .mutation(async ({ ctx, input }) => {
        const { id } = await prisma.project.create({
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
        return id;
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
