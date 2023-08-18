"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { MdCalendarToday } from "react-icons/md";

export const ListView = ({ id: projectId }: { id: string }) => {
  const { data } = trpc.projects.get.useQuery(projectId, {
    useErrorBoundary: true,
    refetchInterval: 30_000,
  });

  if (!data) {
    // Loading UI (skeleton)
    return <ListSkeleton />;
  }

  const tasks = sortByDueDate(
    data.sections.flatMap((section) => section.tasks)
  );

  return (
    <section className="m-4 mx-auto max-w-xl">
      <ul className="flex w-96 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id} isListItem details />
        ))}
        <AddSectionTask projectId={projectId} />
      </ul>
    </section>
  );
};

export const ListSkeleton = () => (
  <section className="m-4 mx-auto max-w-xl">
    <ul className="flex flex-col gap-2">
      {new Array(5).fill(null).map((_, i) => (
        <Card key={i} className="w-96">
          <CardContent className="flex flex-col gap-2 p-4 py-2">
            <div className="flex gap-2">
              <div className="h-6">
                <Checkbox className="my-1" disabled checked={i < 3} />
              </div>
              <Skeleton className="h-6 w-48" />
            </div>
            <Card>
              <CardContent className="flex flex-col gap-2 p-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
            <Button className="justify-start gap-2" disabled variant="outline">
              <MdCalendarToday /> Due <Skeleton className="h-4 w-8" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </ul>
  </section>
);
