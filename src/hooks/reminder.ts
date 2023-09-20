import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import toast from "react-hot-toast";

export const useAddReminder = (task: Task) => {
  const utils = trpc.useContext();

  const { mutateAsync: _addReminder } = trpc.notification.add.useMutation({
    onMutate: ({ projectId, taskId, time }) => {
      utils.notification.list.cancel(taskId);
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
      utils.notification.list.setData(taskId, (list) => {
        if (!list) return undefined;
        return [
          ...list,
          {
            id: newId,
            projectId,
            taskId,
            time,
            userId: "",
            createdAt: new Date(),
          },
        ];
      });
      return { newId };
    },
    onError: (error, { taskId }, context) => {
      toast.error("There was an error adding a reminder!");
      if (!context) return;
      utils.notification.list.setData(taskId, (list) => {
        if (!list) return undefined;
        return list.filter((item) => item.id !== context?.newId);
      });
    },
    onSettled: () => {
      utils.notification.list.invalidate(task.id);
    },
  });

  const addReminder = ({ taskId, time }: { taskId: number; time: Date }) => {
    if (time.getTime() < new Date().getTime()) {
      toast.error("You must set the reminder for a time in the future!");
    } else {
      _addReminder({ taskId, projectId: task.projectId, time });
    }
  };

  return { addReminder };
};

export const useRemoveReminder = (task: Task) => {
  const utils = trpc.useContext();
  const { mutateAsync: removeReminder } = trpc.notification.remove.useMutation({
    onMutate: (id) => {
      const reminder = utils.notification.list
        .getData()
        ?.find((it) => it.id === id);

      utils.notification.list.cancel(task.id);
      utils.notification.list.setData(task.id, (list) => {
        return list?.filter((item) => item.id !== id);
      });

      return reminder;
    },
    onError: (error, id, context) => {
      toast.error("There was an error removing that reminder!");
      if (!context) return;

      utils.notification.list.setData(task.id, (list) => {
        if (!list) return undefined;
        return [...list, context];
      });
    },
    onSettled: () => {
      utils.notification.list.invalidate(task.id);
    },
  });

  return { removeReminder };
};
