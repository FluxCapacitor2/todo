"use client";

import { ProjectSelector } from "@/components/project/ProjectSelector";
import { TaskCard } from "@/components/task/TaskCard";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import {
  addMonths,
  addWeeks,
  endOfTomorrow,
  isBefore,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import groupBy from "just-group-by";
import { Fragment } from "react";
import { ListSkeleton } from "../(perProject)/list/[id]/ListSkeleton";

export default function Page() {
  const { data, isLoading, isError } = trpc.tasks.listTopLevel.useQuery();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <ProjectSelector>
        {(included) => {
          const filtered = data
            ? sortByDueDate(data).filter((task) =>
                included?.some((it) => it.id === task.projectId)
              )
            : undefined;

          const groups = filtered
            ? groupBy(filtered, (task): string => {
                if (!task.dueDate) {
                  return "No Due Date";
                }

                const date = task.dueDate;
                const now = new Date();

                if (date < now) {
                  return "Overdue";
                }

                if (isBefore(date, endOfTomorrow())) {
                  return "Tomorrow";
                }

                if (
                  startOfWeek(now).getTime() === startOfWeek(date).getTime()
                ) {
                  return "This Week";
                }

                if (
                  startOfMonth(now).getTime() === startOfMonth(date).getTime()
                ) {
                  return "This Month";
                }

                if (
                  startOfWeek(addWeeks(now, 1)).getTime() ===
                  startOfWeek(date).getTime()
                ) {
                  return "Next Week";
                }

                if (
                  startOfMonth(addMonths(now, 1)).getTime() ===
                  startOfMonth(date).getTime()
                ) {
                  return "Next Month";
                }

                if (
                  startOfYear(now).getTime() === startOfYear(date).getTime()
                ) {
                  return "This Year";
                }

                return "Beyond";
              })
            : undefined;

          return (
            <>
              {isLoading || !groups ? (
                <ListSkeleton />
              ) : (
                <>
                  {Object.keys(groups).map((group) => (
                    <Fragment key={group}>
                      <h2 className="text-2xl font-bold">{group}</h2>
                      {groups[group]!.map((task) => (
                        <div className="p-2" key={task.id}>
                          <TaskCard task={task} isListItem details />
                        </div>
                      ))}
                    </Fragment>
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
