"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { ListSkeleton } from "./ListSkeleton";

export default function ListView({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const { data } = trpc.projects.get.useQuery(projectId, {
    useErrorBoundary: true,
    refetchInterval: 30_000,
  });

  if (!data) {
    // Loading UI (skeleton)
    return <ListSkeleton />;
  }

  const tasks = sortByDueDate(
    data.sections.flatMap((section) => section.tasks)
  );

  return (
    <section className="m-4 mx-auto flex w-full max-w-xl flex-col gap-4">
      {tasks.map((task) => (
        <TaskCard task={task} key={task.id} isListItem details />
      ))}
      <AddSectionTask projectId={projectId} />
    </section>
  );
}
