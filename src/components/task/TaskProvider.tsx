import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
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
      onError: () => {
        toast.error("There was an error saving that task!");
        setTask(lastRevision); // Roll back the UI to the last known successful state
      },
      onSuccess: (data) => {
        setLastRevision(data);
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
