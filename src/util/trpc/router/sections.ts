import { prisma } from "@/util/prisma";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MyTrpc } from "../trpc-router";
import { deleteTask } from "./tasks";

export const sectionsRouter = (t: MyTrpc) =>
  t.router({
    create: t.procedure
      .input(z.object({ name: z.string(), projectId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const project = await prisma.project.findFirst({
          where: {
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                collaborators: {
                  some: { userId: ctx.session.id, role: Role.EDITOR },
                },
              },
            ],
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
        await deleteSection(input.id, ctx.session.id);
      }),
    update: t.procedure
      .input(
        z.object({
          id: z.number(),
          name: z.optional(z.string()),
          archived: z.optional(z.boolean()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const section = await prisma.section.findFirst({
          where: {
            id: input.id,
            project: {
              OR: [
                {
                  ownerId: ctx.session.id,
                },
                {
                  collaborators: {
                    some: { userId: ctx.session.id, role: Role.EDITOR },
                  },
                },
              ],
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
            archived: input.archived,
          },
        });
      }),
    getArchived: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
      return await prisma.section.findMany({
        where: {
          projectId: input,
          archived: true,
          project: {
            OR: [
              {
                ownerId: ctx.session.id,
              },
              {
                collaborators: {
                  some: { userId: ctx.session.id, role: Role.EDITOR },
                },
              },
            ],
          },
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });
    }),
  });

/**
 * Deletes a section, removing any tasks/sub-tasks in the process.
 */
export async function deleteSection(id: number, ownerId: string) {
  const section = await prisma.section.findFirst({
    where: {
      id,
      project: {
        OR: [
          {
            ownerId: ownerId,
          },
          {
            collaborators: {
              some: {
                userId: ownerId,
                role: Role.EDITOR,
              },
            },
          },
        ],
      },
    },
    include: {
      tasks: {
        include: {
          reminders: true,
          subTasks: true,
        },
      },
    },
  });

  for (const task of section?.tasks ?? []) {
    if (task.subTasks.length > 0 || task.reminders.length > 0) {
      await deleteTask(task.id, ownerId);
    }
  }

  if (!section) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  await prisma.section.delete({
    where: {
      id,
    },
  });
}
