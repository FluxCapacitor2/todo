"use client";

import { GetTaskQuery, TaskModal } from "@/components/task/TaskModal";
import { TaskProvider } from "@/components/task/TaskProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "urql";
import ProjectView from "../page";

export default function Page({
  params: { id, task: taskId },
}: {
  params: { id: string; task: string };
}) {
  const [{ data, fetching, error }] = useQuery({
    query: GetTaskQuery,
    variables: { projectId: id, taskId: parseInt(taskId) },
  });
  const task = data?.me?.project?.task;

  const backPath = `/project/${id}`;
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.prefetch(backPath);
  }

  if (error !== undefined) {
    router.push(backPath);
    toast.error("There was an error finding that task!");
  }

  return (
    <>
      <ProjectView params={{ id }} />
      {task && (
        <>
          <TaskProvider task={task}>
            {({ task, setTask, isSaving }) => (
              <TaskModal
                modalShown={true}
                setModalShown={(x) => {
                  if (x === false) {
                    router.push(backPath);
                  }
                }}
                task={{
                  ...task,
                  dueDate: task.dueDate ?? null,
                  startDate: task.startDate ?? null,
                }}
                setTask={setTask}
                isSaving={isSaving}
              />
            )}
          </TaskProvider>
        </>
      )}
    </>
  );
}
