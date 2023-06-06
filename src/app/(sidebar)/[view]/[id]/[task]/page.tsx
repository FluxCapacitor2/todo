"use client";

import { TaskWrapper } from "@/components/task/TaskCard";
import { TaskModal } from "@/components/task/TaskModal";
import { trpc } from "@/util/trpc/trpc";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getView } from "../_views";

export default function Page({
  params: { view, id, task: taskId },
}: {
  params: { view: string; id: string; task: string };
}) {
  const component = getView(view, id);

  const {
    data: task,
    isLoading,
    isError,
  } = trpc.tasks.get.useQuery(
    { id: parseInt(taskId) },
    { refetchInterval: 30_000 }
  );

  const backPath = `/${view}/${id}`;
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
      {component}
      {task && (
        <>
          <TaskWrapper task={task}>
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
          </TaskWrapper>
        </>
      )}
    </>
  );
}
