"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { TaskCard } from "@/components/task/TaskCard";
import { trpc } from "@/util/trpc/trpc";
import { Skeleton } from "../[view]/[id]/list";

export default function Page() {
  const { data, isLoading, isError } = trpc.tasks.listTopLevel.useQuery();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <ProjectSelector>
        {(included) => {
          const filtered = data?.filter((task) =>
            included?.some((it) => it.id === task.section?.projectId)
          );
          return (
            <>
              {isLoading || !filtered ? (
                <Skeleton />
              ) : (
                <>
                  {filtered.map((task) => (
                    <div className="p-2" key={task.id}>
                      <TaskCard
                        task={task}
                        projectId={task.section!.projectId}
                        isListItem
                        details
                      />
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
