"use client";

import { TaskCard } from "@/components/task/TaskCard";
import { trpc } from "@/util/trpc/trpc";
import { useState } from "react";
import { Skeleton } from "../[view]/[id]/list";

export default function Page() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = trpc.tasks.listCompleted.useQuery({ page });

  return (
    <main className="p-2 pt-1 md:px-6 md:pt-4">
      <section className="mx-auto max-w-xl">
        <h1 className="mb-4 text-2xl font-bold">Completed Tasks</h1>
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
