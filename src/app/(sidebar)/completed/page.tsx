"use client";

import { TaskCard } from "@/components/task/TaskCard";
import { graphql } from "@/gql";
import { useState } from "react";
import { useQuery } from "urql";
import { ListSkeleton } from "../(perProject)/list/[id]/ListSkeleton";

const CompletedTasksQuery = graphql(`
  query completedTasks {
    me {
      tasks(completed: true) {
        id
        name
        description
        projectId
        startDate
        dueDate
        createdAt
        completed
      }
    }
  }
`);

export default function Page() {
  const [page, setPage] = useState(0);
  const [{ data, fetching }] = useQuery({ query: CompletedTasksQuery });
  const tasks = data?.me?.tasks;

  return (
    <main className="p-2 pt-1 md:px-6 md:pt-4">
      <section className="mx-auto max-w-xl">
        <h1 className="mb-4 text-2xl font-bold">Completed Tasks</h1>
        {!data || fetching ? (
          <ListSkeleton />
        ) : (
          <ul className="flex flex-col gap-4">
            {tasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  ...task,
                  dueDate: task.dueDate ?? null,
                  startDate: task.startDate ?? null,
                }}
                isListItem
                details
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
