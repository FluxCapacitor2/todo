import { builder } from "../builder";

builder.prismaObject("Label", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    color: t.exposeString("color"),
  }),
});
