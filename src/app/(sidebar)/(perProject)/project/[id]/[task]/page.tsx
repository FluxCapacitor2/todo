"use client";

import { TaskModal } from "@/components/task/TaskModal";
import { TaskProvider } from "@/components/task/TaskProvider";
import { trpc } from "@/util/trpc/trpc";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectView from "../page";

export default function Page({
  params: { id, task: taskId },
}: {
  params: { id: string; task: string };
}) {
  const {
    data: task,
    isLoading,
    isError,
  } = trpc.tasks.get.useQuery(
    { id: parseInt(taskId) },
    { refetchInterval: 30_000 }
  );

  const backPath = `/project/${id}`;
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.prefetch(backPath);
  }

  if (isError) {
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
                task={task}
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
