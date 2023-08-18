"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { TaskCard } from "@/components/task/TaskCard";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { ListSkeleton } from "../[view]/[id]/list";

export default function Page() {
  const { data, isLoading, isError } = trpc.tasks.listTopLevel.useQuery();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <ProjectSelector>
        {(included) => {
          const filtered = data
            ? sortByDueDate(data).filter((task) =>
                included?.some((it) => it.id === task.section?.projectId)
              )
            : undefined;
          return (
            <>
              {isLoading || !filtered ? (
                <ListSkeleton />
              ) : (
                <>
                  {filtered.map((task) => (
                    <div className="p-2" key={task.id}>
                      <TaskCard task={task} isListItem details />
                    </div>
                  ))}
                </>
              )}
            </>
          );
        }}
      </ProjectSelector>
    </main>
  );
}
