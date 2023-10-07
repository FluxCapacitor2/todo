import { prisma } from "../../../../../src/util/prisma";
import { builder } from "../builder";

/**
 * Non-exposed fields: emailVerified, accounts, sessions, createdAt
 */
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    email: t.exposeString("email", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    apiTokens: t.relation("apiTokens"),
    timePresets: t.relation("timePresets", {
      query: { orderBy: { time: "asc" } },
    }),
    projects: t.prismaField({
      type: ["Project"],
      args: {
        archived: t.arg.boolean(),
      },
      resolve: (query, _parent, args, ctx, _info) =>
        prisma.project.findMany({
          where: {
            archived: args.archived ?? false,
            OR: [
              {
                ownerId: ctx.userId,
              },
              {
                collaborators: {
                  some: {
                    userId: ctx.userId,
                  },
                },
              },
            ],
          },
        }),
    }),
    project: t.prismaField({
      type: "Project",
      args: {
        id: t.arg.string(),
      },
      resolve: (query, _parent, args, ctx, _info) =>
        prisma.project.findFirstOrThrow({
          where: {
            id: args.id!,
            OR: [
              { ownerId: ctx.userId },
              { collaborators: { some: { userId: ctx.userId } } },
            ],
          },
        }),
    }),
    tasks: t.prismaField({
      type: ["Task"],
      args: {
        first: t.arg.int({ defaultValue: 20 }),
        skip: t.arg.int({ defaultValue: 0 }),
        completed: t.arg.boolean({ defaultValue: false }),
      },

      resolve: (query, _parent, args, ctx, _info) =>
        prisma.task.findMany({
          ...query,
          where: {
            completed: args.completed ?? false,
            project: {
              archived: false,
              OR: [
                {
                  ownerId: ctx.userId,
                },
                { collaborators: { some: { userId: ctx.userId } } },
              ],
            },
            parentTask: null,
            section: {
              archived: false,
            },
          },
          orderBy: args.completed
            ? [
                {
                  updatedAt: "desc",
                },
              ]
            : [
                {
                  dueDate: {
                    sort: "asc",
                    nulls: "last",
                  },
                },
                {
                  createdAt: "asc",
                },
              ],
          take: args.first ?? 50,
          skip: args.skip ?? 0,
        }),
    }),
    apiToken: t.prismaField({
      type: "ApiToken",
      resolve: async (query, _parent, args, ctx, _info) => {
        const token = await prisma.apiToken.findFirst({
          where: { userId: ctx.userId },
        });
        if (!token) {
          return await prisma.apiToken.create({ data: { userId: ctx.userId } });
        } else {
          return token;
        }
      },
    }),
    incomingInvitations: t.relation("incomingInvitations"),
    outgoingInvitations: t.relation("outgoingInvitations"),
    notificationTokens: t.relation("notificationTokens"),
  }),
});

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: (query, _parent, args, ctx, _info) =>
      prisma.user.findFirst({
        where: {
          id: ctx.userId,
        },
      }),
  })
);
