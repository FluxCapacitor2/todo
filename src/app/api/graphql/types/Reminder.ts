import { prisma } from "../../../../util/prisma";
import { builder } from "../builder";

builder.prismaObject("Reminder", {
  fields: (t) => ({
    id: t.exposeID("id"),
    task: t.relation("Task"),
    time: t.expose("time", { type: "DateTime" }),
    taskId: t.exposeInt("taskId"),
  }),
});

builder.mutationField("createReminder", (t) =>
  t.prismaField({
    type: "Reminder",
    args: {
      taskId: t.arg.int(),
      time: t.arg({ type: "DateTime" }),
    },
    resolve: async (query, parent, args, context, info) => {
      const task = await prisma.task.findFirst({
        where: {
          OR: [
            { ownerId: context.userId },
            {
              project: { collaborators: { some: { userId: context.userId } } },
            },
          ],
          id: args.taskId!,
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return await prisma.reminder.create({
        data: {
          projectId: task!.projectId,
          taskId: task!.id,
          time: args.time!,
          userId: context.userId,
        },
      });
    },
  })
);

builder.mutationField("deleteReminder", (t) =>
  t.prismaField({
    type: "Reminder",
    args: {
      id: t.arg.int(),
    },
    resolve: async (query, parent, args, context, info) => {
      const reminder = await prisma.reminder.findFirst({
        where: {
          userId: context.userId,
          Task: {
            OR: [
              { ownerId: context.userId },
              {
                project: {
                  collaborators: { some: { userId: context.userId } },
                },
              },
            ],
          },
          id: args.id!,
        },
      });

      if (!reminder) {
        throw new Error("Reminder not found");
      }

      return await prisma.reminder.delete({ where: { id: reminder.id } });
    },
  })
);
