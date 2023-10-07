import { graphql } from "@/gql";
import { Task } from "@/gql/graphql";
import { RequireOf } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "urql";
import { useDebounce } from "use-debounce";

const UpdateTaskMutation = graphql(`
  mutation updateTask($id: Int!) {
    updateTask(id: $id) {
      id
      name
      description
      priority
      createdAt
      updatedAt
      completed
      startDate
      dueDate
      sectionId
      parentTaskId
      ownerId
      projectId
    }
  }
`);

export const TaskProvider = <
  T extends Omit<
    RequireOf<Task, "id">,
    "section" | "project" | "parentTask" | "reminders" | "subTasks"
  >
>({
  task: inTask,
  children,
}: {
  task: T;
  children: (value: {
    task: T;
    setTask: (task: T) => void;
    isSaving: boolean;
  }) => ReactNode;
}) => {
  const [task, setTask] = useState(inTask);
  const initialRender = useRef(true);

  const [updateTaskState, updateTask] = useMutation(UpdateTaskMutation);

  useEffect(() => {
    setTask(inTask); // Force the task to update when new data is received
    initialRender.current = true; // Prevent the update from causing a mutation
  }, [inTask]);

  const [lastRevision, setLastRevision] = useState(inTask);

  const update = async (newValue: Parameters<typeof updateTask>[0]) => {
    // console.log("update triggered with old=>new: ", task, newValue);
    // TODO prevent infinite loop of updates!!
    // Ideally, every update would just be in its own query since we have 'automatic' optimistic updates with URQL
    const result = await updateTask(newValue);
    if (result.error) {
      toast.error("There was an error updating that task!");
      setTask(lastRevision);
    } else {
      // @ts-ignore - TODO Try to get this working properly with a generic
      setLastRevision(result.data!.updateTask!);
    }
  };

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
      update({
        ...debouncedTask,
        id: parseInt(debouncedTask.id!),
        dueDate: debouncedTask.dueDate ?? undefined,
        startDate: debouncedTask.startDate ?? undefined,
      });
    }
  }, [debouncedTask]);

  return <>{children({ task, setTask, isSaving: updateTaskState.fetching })}</>;
};
