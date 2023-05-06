import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "../prisma";
import { Context } from "./context";
import { z } from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  projects: t.router({
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
  }),
  sections: t.router({
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
  }),
  tasks: t.router({
    create: t.procedure
      .input(
        z.object({
          sectionId: z.number(),
          name: z.string(),
          description: z.optional(z.string()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const section = await prisma.section.findFirst({
          where: {
            id: input.sectionId,
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
            id: input.sectionId,
          },
          data: {
            tasks: {
              create: {
                name: input.name,
                description: input.description ?? "",
                ownerId: ctx.session.id,
              },
            },
          },
        });
      }),
    delete: t.procedure.input(z.number()).mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findFirst({
        where: {
          id: input,
          ownerId: ctx.session.id,
        },
      });
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      return await prisma.task.delete({
        where: {
          id: input,
        },
      });
    }),
    update: t.procedure
      .input(
        z
          .object({
            name: z.string(),
            description: z.string(),
            // labels: z.array(z.string()),
            priority: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
            completed: z.boolean(),
            startDate: z.date(),
            dueDate: z.date(),
          })
          .partial()
          .extend({
            id: z.number(),
          })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            ownerId: ctx.session.id,
          },
        });

        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return await prisma.task.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            priority: input.priority,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            completed: input.completed,
            startDate: input.startDate,
            dueDate: input.dueDate,
          },
        });
      }),
    addSubtask: t.procedure
      .input(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            ownerId: ctx.session.id,
          },
        });
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return await prisma.task.update({
          where: {
            id: input.id,
          },
          data: {
            subTasks: {
              create: [
                {
                  name: input.name,
                  description: input.description,
                  ownerId: ctx.session.id,
                },
              ],
            },
          },
        });
      }),
    get: t.procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const task = await prisma.task.findFirst({
          where: {
            id: input.id,
            ownerId: ctx.session.id,
          },
          include: {
            parentTask: true,
            subTasks: true,
          },
        });
        if (task === null) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return task;
      }),
  }),
});

export type AppRouter = typeof appRouter;
