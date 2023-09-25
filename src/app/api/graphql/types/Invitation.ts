import { Role } from "@prisma/client";
import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("Invitation", {
  fields: (t) => ({
    id: t.exposeID("id"),
    from: t.relation("from"),
    to: t.relation("to"),
    project: t.relation("project"),
  }),
});

builder.mutationField("acceptInvitation", (t) =>
  t.prismaField({
    type: "Invitation",
    args: {
      id: t.arg.string(),
    },
    resolve: async (parent, _, args, context, info) => {
      return await prisma.$transaction(async (tx) => {
        const invitation = await tx.invitation.delete({
          where: { id: args.id!! },
        });
        if (invitation.receiverId !== context.userId) {
          throw new Error("Unauthorized");
        }
        await tx.project.update({
          where: {
            id: invitation.projectId,
          },
          data: {
            collaborators: {
              create: {
                role: Role.EDITOR,
                userId: context.userId,
              },
            },
          },
        });

        return invitation;
      });
    },
  })
);

builder.mutationField("rejectInvitation", (t) =>
  t.prismaField({
    type: "Invitation",
    args: {
      id: t.arg.string(),
    },
    resolve: async (parent, _, args, context, info) => {
      const invitation = await prisma.invitation.findFirst({
        where: {
          senderId: context.userId,
          id: args.id!!,
        },
      });
      if (!invitation) {
        throw new Error("Invitation not found");
      }
      return await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });
    },
  })
);
