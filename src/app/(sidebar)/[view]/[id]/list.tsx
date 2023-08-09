"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Checkbox } from "@/components/ui/checkbox";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";

export const ListView = ({ id: projectId }: { id: string }) => {
  const { data } = trpc.projects.get.useQuery(projectId, {
    useErrorBoundary: true,
    refetchInterval: 30_000,
  });

  if (!data) {
    // Loading UI (skeleton)
    return <Skeleton />;
  }

  const tasks = sortByDueDate(
    data.sections.flatMap((section) => section.tasks)
  );

  return (
    <section className="m-4 mx-auto max-w-xl">
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id} isListItem details />
        ))}
        <AddSectionTask projectId={projectId} />
      </ul>
    </section>
  );
};

export const Skeleton = () => (
  <section className="m-4 mx-auto max-w-xl">
    <ul className="flex flex-col gap-2">
      {new Array(5).fill(null).map((_, i) => (
        <div key={i} className="flex items-start gap-2">
          <Checkbox disabled className="mt-1" checked={i < 3} />
          <div className="flex flex-col gap-2">
            <div
              className="my-1 h-8 w-64 animate-pulse rounded-md bg-gray-500/50"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <div
              className="my-1 h-4 w-48 animate-pulse rounded-md bg-gray-500/50"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          </div>
        </div>
      ))}
    </ul>
  </section>
);
