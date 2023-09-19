"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { trpc } from "@/util/trpc/trpc";
import { ListSkeleton } from "./ListSkeleton";
import { TaskList } from "./TaskList";

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

  const tasks = data.sections.flatMap((section) => section.tasks);

  return (
    <section className="m-4 mx-auto flex w-full max-w-xl flex-col gap-4">
      <TaskList tasks={tasks} />
      <AddSectionTask projectId={projectId} />
    </section>
  );
}
