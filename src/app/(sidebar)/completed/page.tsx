"use client";

import { trpc } from "@/util/trpc/trpc";
import { useState } from "react";
import { Skeleton } from "../[view]/[id]/list";
import { TaskCard } from "@/components/task/TaskCard";

export default function Page() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = trpc.tasks.listCompleted.useQuery(
    { page },
    { useErrorBoundary: true }
  );

  return (
    <main className="px-2 md:px-6 md:pt-4">
      <section className="m-4 mx-auto max-w-xl">
        <h1 className="mb-4 text-3xl font-bold">Completed Tasks</h1>
        {!data || isLoading ? (
          <Skeleton />
        ) : (
          <ul className="flex flex-col gap-4">
            {data.map((task) => (
              <TaskCard key={task.id} task={task} isListItem details />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
