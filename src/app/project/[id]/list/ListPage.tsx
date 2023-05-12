"use client";

import { Project, Section, Task } from "@prisma/client";
import { TaskCard } from "@/components/task/TaskCard";
import { trpc } from "@/util/trpc/trpc";
import { Spinner } from "@/components/ui/Spinner";
import { AddSectionTask } from "@/components/task/AddTask";

export const ListPage = ({
  project,
}: {
  project: Project & { sections: (Section & { tasks: Task[] })[] };
}) => {
  const { data } = trpc.projects.get.useQuery(project.id, {
    initialData: project,
  });

  if (!data) {
    return <Spinner />;
  }

  const tasks = data.sections
    .flatMap((section) => section.tasks)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (a.dueDate && !b.dueDate) return 1;
      if (!a.dueDate && b.dueDate) return -1;
      return a.dueDate!.getTime() - b.dueDate!.getTime();
    });

  return (
    <section className="m-4 mx-auto max-w-xl">
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            projectId={project.id}
            key={task.id}
            isListItem
          />
        ))}
        <AddSectionTask projectId={project.id} />
      </ul>
    </section>
  );
};
