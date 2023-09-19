import { TaskCard } from "@/components/task/TaskCard";
import { sortByDueDate } from "@/util/sort";
import type { Project, Section, Task } from "@prisma/client";
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
import Link from "next/link";
import { Fragment } from "react";

export const TaskList = ({
  tasks: inTasks,
  readonly = false,
}: {
  tasks: (Task & {
    project?: Pick<Project, "name">;
    section: Pick<Section, "name"> | null | undefined;
  })[];
  readonly?: boolean;
}) => {
  const groups = group(sortByDueDate(inTasks));

  return (
    <>
      {Object.keys(groups).map((group) => (
        <Fragment key={group}>
          <h2 className="text-2xl font-bold">{group}</h2>
          {groups[group]!.map((task) => (
            <div className="p-2" key={task.id}>
              {task.project?.name ? (
                <Link
                  className="mb-2 block text-xs text-muted-foreground"
                  href={`/project/${task.projectId}`}
                >
                  {task.project?.name} &raquo; {task.section?.name}
                </Link>
              ) : (
                <p className="mb-2 text-xs text-muted-foreground">
                  {task.section?.name}
                </p>
              )}
              <TaskCard task={task} isListItem details readonly={readonly} />
            </div>
          ))}
        </Fragment>
      ))}
    </>
  );
};

const group = <T extends Task>(tasks: T[]): Record<string, T[]> =>
  groupBy(tasks, (task): string => {
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

    if (startOfWeek(now).getTime() === startOfWeek(date).getTime()) {
      return "This Week";
    }

    if (startOfMonth(now).getTime() === startOfMonth(date).getTime()) {
      return "This Month";
    }

    if (
      startOfWeek(addWeeks(now, 1)).getTime() === startOfWeek(date).getTime()
    ) {
      return "Next Week";
    }

    if (
      startOfMonth(addMonths(now, 1)).getTime() === startOfMonth(date).getTime()
    ) {
      return "Next Month";
    }

    if (startOfYear(now).getTime() === startOfYear(date).getTime()) {
      return "This Year";
    }

    return "Beyond";
  });
