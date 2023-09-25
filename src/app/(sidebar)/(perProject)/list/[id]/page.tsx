"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { useQuery } from "urql";
import { GetProjectQuery } from "../../../../queries";
import { ListSkeleton } from "./ListSkeleton";
import { TaskList } from "./TaskList";

export default function ListView({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const [{ data, fetching }] = useQuery({
    query: GetProjectQuery,
    variables: { id: projectId },
  });

  const sections = data?.me?.project?.sections;
  const archived = data?.me?.project?.archived;

  const tasks = sections?.flatMap((section) =>
    section.tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate ?? null,
      startDate: task.startDate ?? null,
      section: {
        name: section.name!,
        archived: section.archived,
      },
      project: { name: data!.me!.project.name! },
    }))
  );

  if (!tasks || fetching) {
    // Loading UI (skeleton)
    return <ListSkeleton />;
  }

  return (
    <section className="m-4 mx-auto flex w-full max-w-xl flex-col gap-4">
      <TaskList tasks={tasks} readonly={archived} />
      {!archived && <AddSectionTask projectId={projectId} />}
    </section>
  );
}
