import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { produce } from "immer";
import { ReactNode, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

export const TaskProvider = ({
  task: inTask,
  children,
}: {
  task: Task;
  children: (value: {
    task: Task;
    setTask: (task: Task) => void;
    isSaving: boolean;
  }) => ReactNode;
}) => {
  const [task, setTask] = useState(inTask);
  const initialRender = useRef(true);
  const utils = trpc.useContext();

  useEffect(() => {
    setTask(inTask); // Force the task to update when new data is received
    initialRender.current = true; // Prevent the update from causing a mutation
  }, [inTask]);

  const [lastRevision, setLastRevision] = useState(inTask);

  const { mutateAsync: updateAsync, isLoading: isSaving } =
    trpc.tasks.update.useMutation({
      onMutate: ({ id, completed }) => {
        const data = utils.tasks.get.getData({ id });
        if (data?.parentTaskId) {
          utils.tasks.get.cancel({ id });
          utils.tasks.get.setData({ id: data.parentTaskId }, (task) =>
            produce(task, (task) => {
              if (!task) return task;
              for (const subTask of task.subTasks) {
                if (subTask.id === id) {
                  if (completed !== undefined) {
                    subTask.completed = completed;
                  }
                }
              }
            })
          );
        }

        if (completed !== undefined) {
          utils.tasks.listCompleted.invalidate();
        }
      },
      onError: () => {
        toast.error("There was an error saving that task!");
        setTask(lastRevision); // Roll back the UI to the last known successful state
      },
      onSuccess: (data, variables) => {
        setLastRevision(data);

        const fullData = utils.tasks.get.getData({ id: data.id });
        const parentTask = fullData?.parentTaskId
          ? utils.tasks.get.getData({
              id: fullData.parentTaskId,
            })
          : undefined;

        if (
          fullData?.parentTask &&
          parentTask &&
          fullData.parentTask.sectionId !== null
        ) {
          // Update the parent task's count of complete/incomplete subtasks
          utils.projects.get.setData(data.projectId, (project) =>
            produce(project, (project) => {
              if (!project) return project;
              for (const section of project.sections) {
                for (const task of section.tasks) {
                  if (task.id === data.parentTaskId) {
                    const subTasks = parentTask.subTasks.length;
                    const completedSubTasks = parentTask.subTasks.reduce(
                      (acc, task) => acc + (task.completed ? 1 : 0),
                      0
                    );
                    const newList = [];
                    for (let i = 0; i < subTasks; i++) {
                      newList.push({ completed: i < completedSubTasks });
                    }
                    task.subTasks = newList;
                  }
                }
              }
            })
          );
        }

        if (variables.completed === true && data.sectionId !== null) {
          // Refresh projects when completing top-level tasks,
          // as completed tasks are hidden in the project view.
          utils.projects.get.invalidate(data.projectId);

          // Optimistic update
          utils.projects.get.setData(data.projectId, (project) =>
            produce(project, (project) => {
              if (!project) return project;
              for (const section of project.sections) {
                section.tasks = section.tasks.filter(
                  (it) => it.id !== variables.id
                );
              }
            })
          );
        }

        if (data.sectionId !== null) {
          utils.projects.get.setData(data.projectId, (project) =>
            produce(project, (project) => {
              if (!project) return project;
              for (const section of project.sections) {
                for (let task of section.tasks) {
                  task = { ...data, subTasks: task.subTasks };
                }
              }
            })
          );
        }
      },
    });

  const [debouncedTask] = useDebounce(task, 500, {
    leading: true,
    trailing: true,
    maxWait: 2500,
  });

  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    } else {
      updateAsync({
        ...debouncedTask,
        dueDate: debouncedTask.dueDate ?? undefined,
        startDate: debouncedTask.startDate ?? undefined,
      });
    }
  }, [debouncedTask, updateAsync]);

  return <>{children({ task, setTask, isSaving })}</>;
};
