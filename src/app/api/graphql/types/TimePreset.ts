import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("TimePreset", {
  fields: (t) => ({
    id: t.exposeID("id"),
    userId: t.exposeString("userId", { nullable: true }),
    time: t.exposeInt("time"),
  }),
});

builder.mutationField("addTimePreset", (t) =>
  t.prismaField({
    type: ["TimePreset"],
    args: {
      time: t.arg.int(),
    },
    resolve: async (query, parent, args, context, info) => {
      const existingTimePreset = await prisma.timePreset.findFirst({
        where: {
          userId: context.userId,
          time: args.time!,
        },
      });

      if (existingTimePreset !== null) {
        throw new Error("Time preset already exists");
      }

      return (
        await prisma.user.update({
          where: {
            id: context.userId,
          },
          data: {
            timePresets: {
              create: {
                time: args.time!,
              },
            },
          },
          include: {
            timePresets: {
              orderBy: {
                time: "asc",
              },
            },
          },
        })
      ).timePresets;
    },
  })
);

builder.mutationField("removeTimePreset", (t) =>
  t.prismaField({
    type: ["TimePreset"],
    args: {
      id: t.arg.int(),
    },
    resolve: async (query, parent, args, context, info) => {
      return (
        await prisma.user.update({
          where: {
            id: context.userId,
          },
          data: {
            timePresets: {
              delete: {
                id: args.id!,
              },
            },
          },
          include: {
            timePresets: {
              orderBy: {
                time: "asc",
              },
            },
          },
        })
      ).timePresets;
    },
  })
);
