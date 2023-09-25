"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { graphql } from "@/gql";
import { useQuery } from "urql";
import { ListSkeleton } from "../(perProject)/list/[id]/ListSkeleton";
import { TaskList } from "../(perProject)/list/[id]/TaskList";

const GetTasksQuery = graphql(`
  query getTasks {
    me {
      id
      tasks {
        id
        name
        description
        completed
        section {
          id
          name
          archived
        }
        projectId
        dueDate
        startDate
        createdAt
        project {
          id
          name
        }
      }
    }
  }
`);

export default function Page() {
  const [{ data, fetching }] = useQuery({ query: GetTasksQuery });
  const tasks = data?.me?.tasks;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <ProjectSelector>
        {(included) => {
          const filtered = data
            ? tasks
                ?.filter((task) =>
                  included?.some((it) => it.id === task.projectId)
                )
                ?.map((task) => ({
                  ...task,
                  dueDate: task.dueDate ?? null,
                  startDate: task.startDate ?? null,
                }))
            : undefined;

          return (
            <>
              {fetching || !filtered ? (
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
