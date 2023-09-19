import { TaskCard } from "@/components/task/TaskCard";
import { sortByDueDate } from "@/util/sort";
import type { Task } from "@prisma/client";
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

export const TaskList = ({ tasks: inTasks }: { tasks: Task[] }) => {
  const groups = group(sortByDueDate(inTasks));

  return (
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
  );
};

const group = (tasks: Task[]) =>
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
