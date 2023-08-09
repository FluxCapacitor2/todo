import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { produce } from "immer";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const defaultTask = {
  completed: false,
  createdAt: new Date(),
  dueDate: null,
  ownerId: "",
  parentTaskId: null,
  priority: 0,
  startDate: null,
  updatedAt: new Date(),
  subTasks: [],
};

export const useCreateTask = (projectId: string) => {
  const utils = trpc.useContext();

  const { mutateAsync: createTask } = trpc.tasks.create.useMutation({
    onMutate: ({ sectionId, name, description, dueDate }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.projects.get.cancel(projectId);

      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return produce(project, (project) => {
          for (const section of project.sections) {
            if (section.id === sectionId) {
              section.tasks.push({
                ...defaultTask,
                id: newId,
                sectionId,
                name,
                description: description ?? "",
                dueDate,
                projectId,
              });
            }
          }
        });
      });

      return { newId };
    },
    onError: (error, { sectionId, name, description }, context) => {
      toast.error("There was an error adding a new task!");
      if (!context) return;

      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return produce(project, (project) => {
          for (const section of project.sections) {
            section.tasks = section.tasks.filter(
              (it) => it.id !== context.newId
            );
          }
        });
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });

  return { createTask };
};

export const useCreateSubtask = (projectId: string, parentTaskId: number) => {
  const utils = trpc.useContext();
  const { mutateAsync: createSubtask } = trpc.tasks.addSubtask.useMutation({
    onMutate: ({ name, id, description, dueDate }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.tasks.get.cancel({ id: parentTaskId });
      utils.tasks.get.setData({ id: parentTaskId }, (task) => {
        if (!task) return undefined;
        return {
          ...task,
          subTasks: [
            ...task.subTasks,
            {
              ...defaultTask,
              id: newId,
              parentTaskId: id,
              sectionId: null,
              name,
              description: description ?? "",
              dueDate,
              projectId,
            },
          ],
        };
      });

      return { newId };
    },
    onError: (error, { name, id, description }, context) => {
      toast.error("There was an error adding that sub-task!");
      if (!context) return;
      utils.tasks.get.setData({ id }, (task) => {
        if (!task) return undefined;
        return {
          ...task,
          subTasks: task.subTasks.filter((it) => it.id !== context.newId),
        };
      });
    },
    onSettled: () => {
      utils.tasks.get.invalidate({ id: parentTaskId });
    },
  });

  return { createSubtask };
};

export const useDeleteTask = (task: Task) => {
  const utils = trpc.useContext();
  const { mutateAsync: deleteAsync } = trpc.tasks.delete.useMutation({
    onMutate: async (id) => {
      // Optimistic update
      let oldTask: Task & { subTasks?: { completed: boolean }[] } = task;
      if (task.parentTaskId) {
        oldTask = task;
        utils.tasks.get.cancel({ id: task.parentTaskId });
        utils.tasks.get.setData({ id: task.parentTaskId }, (task) => {
          if (!task) return undefined;
          return produce(task, (task) => {
            task.subTasks = task.subTasks.filter((it) => it.id !== id);
          });
        });
      } else {
        utils.tasks.listTopLevel.cancel();
        utils.projects.get.cancel(task.projectId);
        utils.projects.get.setData(task.projectId, (project) => {
          if (!project) return undefined;
          const newValue = produce(project, (project) => {
            for (const section of project.sections) {
              section.tasks = section.tasks.filter((task) => {
                if (task.id !== id) {
                  return true;
                } else {
                  oldTask = task;
                  return false;
                }
              });
            }
          });
          return newValue;
        });
      }

      return { task: oldTask };
    },
    onError: (error, id, context) => {
      toast.error("There was an error deleting that task!");
      if (task.parentTaskId) {
        utils.tasks.get.setData({ id: task.parentTaskId }, (task) => {
          if (!task) return undefined;
          if (!context?.task) return task;
          return { ...task, subTasks: [...task.subTasks, context.task] };
        });
      } else {
        utils.projects.get.setData(task.projectId, (project) => {
          if (!project) return undefined;
          return produce(project, (project) => {
            const section = project.sections.find(
              (section) => section.id === task.sectionId
            );
            if (context?.task) {
              section?.tasks?.push?.(
                context.task as Task & { subTasks: { completed: boolean }[] }
              );
            }
          });
        });
      }
    },
    onSettled: (data) => {
      if (task.parentTaskId) {
        utils.tasks.get.invalidate({ id: task.parentTaskId });
      } else {
        utils.tasks.listTopLevel.invalidate();
        utils.projects.get.invalidate(task.projectId);
      }
    },
  });

  return { deleteAsync };
};

export const useCopyTaskURL = (task: Task) => {
  const pathname = usePathname();
  const copy = () => {
    navigator.clipboard.writeText(
      pathname?.includes(task.projectId)
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}/${task.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/project/${task.projectId}/${task.id}`
    );
  };
  return { copy };
};
