"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { trpc } from "@/util/trpc/trpc";
import { ListSkeleton } from "../(perProject)/list/[id]/ListSkeleton";
import { TaskList } from "../(perProject)/list/[id]/TaskList";

export default function Page() {
  const { data, isLoading, isError } = trpc.tasks.listTopLevel.useQuery();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <ProjectSelector>
        {(included) => {
          const filtered = data
            ? data.filter((task) =>
                included?.some((it) => it.id === task.projectId)
              )
            : undefined;

          return (
            <>
              {isLoading || !filtered ? (
                <ListSkeleton />
              ) : (
                <TaskList tasks={filtered} />
              )}
            </>
          );
        }}
      </ProjectSelector>
    </main>
  );
}
