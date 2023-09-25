import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateTimeResolver } from "graphql-scalars";
import { Session } from "next-auth";
import { prisma } from "../../../../src/util/prisma";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  Context: {
    user: Session["user"];
    userId: string;
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
});

builder.mutationType({});
