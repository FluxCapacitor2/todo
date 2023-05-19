"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { Calendar } from "../[view]/[id]/calendar";

export default function Page() {
  const { data, isLoading, isError } = trpc.tasks.listTopLevel.useQuery();

  const mapped = data
    ? sortByDueDate(data).map((task) => ({
        ...task,
        projectId: task.section!.projectId,
      }))
    : null;

  return (
    <main className="px-2 pt-4 md:px-6">
      <ProjectSelector>
        {(included) => {
          const filtered = mapped?.filter((task) =>
            included?.some((it) => it.id === task.projectId)
          );

          return <Calendar tasks={filtered} />;
        }}
      </ProjectSelector>
    </main>
  );
}
