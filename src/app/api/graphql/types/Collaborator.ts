import { Role } from "@prisma/client";
import { builder } from "../builder";

const role = builder.enumType(Role, { name: "Role" });

builder.prismaObject("Collaborator", {
  include: {
    sections: true,
  },
  fields: (t) => ({
    id: t.exposeID("id"),
    user: t.relation("user"),
    project: t.relation("Project"),
    role: t.expose("role", { type: role }),
  }),
});
