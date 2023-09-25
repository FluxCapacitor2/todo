import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("ApiToken", {
  fields: (t) => ({
    id: t.exposeID("id"),
    generatedAt: t.expose("generatedAt", { type: "DateTime" }),
  }),
});

builder.mutationField("rerollApiToken", (t) =>
  t.prismaField({
    type: "ApiToken",
    args: {
      id: t.arg.string(),
    },
    resolve: async (parent, _, args, context, info) => {
      return await prisma
        .$transaction([
          prisma.apiToken.delete({ where: { id: args.id! } }),
          prisma.apiToken.create({ data: { userId: context.userId } }),
        ])
        .then((results) => results[1]);
    },
  })
);
