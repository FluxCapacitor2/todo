"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Spinner } from "@/components/ui/Spinner";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";

export default async function Page({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const { data } = trpc.projects.get.useQuery(projectId);

  if (!data) {
    return <Spinner />;
  }

  const tasks = sortByDueDate(
    data.sections.flatMap((section) => section.tasks)
  );

  return (
    <section className="m-4 mx-auto max-w-xl">
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            projectId={projectId}
            key={task.id}
            isListItem
            details
          />
        ))}
        <AddSectionTask projectId={projectId} />
      </ul>
    </section>
  );
}
