import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("NotificationToken", {
  fields: (t) => ({
    id: t.exposeID("id"),
    token: t.exposeString("token"),
    userAgent: t.exposeString("userAgent"),
  }),
});

builder.mutationField("addNotificationToken", (t) =>
  t.prismaField({
    type: "NotificationToken",
    args: {
      token: t.arg.string(),
      userAgent: t.arg.string(),
    },
    resolve: async (query, parent, args, context, info) => {
      return await prisma.notificationToken.create({
        data: {
          userId: context.userId,
          token: args.token!,
          userAgent: args.userAgent!,
        },
      });
    },
  })
);

builder.mutationField("removeNotificationToken", (t) =>
  t.prismaField({
    type: "NotificationToken",
    args: {
      token: t.arg.string(),
    },
    resolve: async (query, parent, args, context, info) => {
      return await prisma.notificationToken.delete({
        where: {
          userId: context.userId,
          token: args.token!,
        },
      });
    },
  })
);
