import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("Project", {
  include: {
    sections: true,
  },
  fields: (t) => ({
    id: t.exposeID("id"),
    ownerId: t.exposeString("ownerId"),
    owner: t.relation("owner"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    sections: t.prismaField({
      type: ["Section"],
      args: {
        archived: t.arg.boolean({ defaultValue: false }),
      },
      resolve: (query, parent, args, context, info) =>
        prisma.section.findMany({
          where: { projectId: parent.id, archived: !!args.archived },
        }),
    }),
    invitations: t.relation("invitations"),
    collaborators: t.relation("collaborators"),
    archived: t.exposeBoolean("archived"),
    task: t.prismaField({
      type: "Task",
      args: {
        id: t.arg.int(),
      },
      resolve: (query, parent, args, context, info) =>
        prisma.task.findFirstOrThrow({ where: { id: args.id! } }),
    }),
  }),
});

builder.mutationField("deleteProject", (t) =>
  t.prismaField({
    type: "Project",
    args: {
      id: t.arg.string(),
    },
    resolve: (fields, _, args, context, info) => {
      return prisma.$transaction((tx) => {
        tx.task.deleteMany({
          where: {
            projectId: args.id!,
          },
        });

        tx.section.deleteMany({
          where: {
            projectId: args.id!,
          },
        });

        return tx.project.delete({ where: { id: args.id! } });
      });
    },
  })
);

builder.mutationField("removeCollaborator", (t) =>
  t.prismaField({
    type: "Project",
    args: {
      projectId: t.arg.string(),
      id: t.arg.string(),
    },
    resolve: async (fields, _, args, context, info) => {
      const project = await prisma.project.findFirstOrThrow({
        where: {
          id: args.projectId!,
        },
      });

      if (project.ownerId !== context.userId) {
        throw new Error("Only the project owner can manage collaborators!");
      }

      const data = await prisma.collaborator.delete({
        where: {
          id: args.id!,
        },
        include: {
          Project: true,
        },
      });

      if (!data || !data.Project) {
        throw new Error("Collaborator not found");
      }

      return data.Project;
    },
  })
);

builder.mutationField("inviteCollaborator", (t) =>
  t.prismaField({
    type: "Project",
    args: {
      projectId: t.arg.string(),
      email: t.arg.string(),
    },
    resolve: async (fields, _, args, context, info) => {
      const otherUser = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
        include: {
          incomingInvitations: true,
        },
      });
      if (!otherUser) {
        throw new Error("User not found");
      }
      if (
        otherUser.incomingInvitations.some(
          (it) => it.projectId === args.projectId
        )
      ) {
        throw new Error("You've already invited this user!");
      }
      const result = await prisma.invitation.create({
        data: {
          senderId: context.userId,
          receiverId: otherUser.id,
          projectId: args.projectId!,
        },
        include: {
          project: true,
        },
      });

      return result.project;
    },
  })
);

builder.mutationField("createNewProject", (t) =>
  t.prismaField({
    type: "Project",
    args: {
      name: t.arg.string(),
    },
    resolve: async (fields, _, args, context, info) => {
      return await prisma.project.create({
        data: {
          name: args.name!,
          ownerId: context.userId,
          sections: {
            create: {
              name: "New Section",
            },
          },
        },
      });
    },
  })
);

builder.mutationField("updateProject", (t) =>
  t.prismaField({
    type: "Project",
    args: {
      id: t.arg.string(),
      name: t.arg.string({ required: false }),
      archived: t.arg.boolean({ required: false }),
    },
    resolve: async (fields, _, args, context, info) => {
      return await prisma.project.update({
        where: {
          id: args.id!,
          ownerId: context.userId,
        },
        data: {
          ...(args.name ? { name: args.name! } : {}),
          ...(args.archived !== null && args.archived !== undefined
            ? { archived: args.archived! }
            : {}),
        },
      });
    },
  })
);
