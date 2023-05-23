"use client";

import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/Button";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { DPDay, useDatePicker } from "@rehookify/datepicker";
import clsx from "clsx";
import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdCalendarToday } from "react-icons/md";

export const CalendarView = ({ id: projectId }: { id: string }) => {
  const { data } = trpc.projects.get.useQuery(projectId, {
    useErrorBoundary: true,
    refetchInterval: 30_000,
  });

  const mapped = data
    ? data.sections.flatMap((section) =>
        section.tasks.map((task) => ({ ...task, projectId }))
      )
    : null;

  return <Calendar tasks={mapped} />;
};

export const Calendar = ({
  tasks,
}: {
  tasks: (Task & { projectId: string })[] | null | undefined;
}) => {
  const [selectedDates, onDatesChange] = useState<Date[]>([new Date()]);
  const {
    data: { weekDays, calendars },
    propGetters: { previousMonthButton, nextMonthButton },
    actions: { setMonth },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
  });

  const { year, month, days } = calendars[0];
  return (
    <section className="mx-auto md:m-4 md:px-4">
      <header>
        <div className="mb-6 flex flex-col items-center gap-4">
          <p className="text-3xl font-bold">
            {month} {year}
          </p>
          <div className="flex gap-2">
            <Button variant="subtle" {...previousMonthButton()}>
              <MdArrowBack />
            </Button>

            <Button variant="subtle" onClick={() => setMonth(new Date())}>
              <MdCalendarToday /> Today
            </Button>

            <Button variant="subtle" {...nextMonthButton()}>
              <MdArrowForward />
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-7 place-items-center">
          {weekDays.map((day) => (
            <li key={`${month}-${day}`}>{day}</li>
          ))}
        </ul>
      </header>
      <ul className="grid grid-cols-7">
        {days.map((dpDay) => (
          <li
            key={`${year}-${month}-${dpDay.day}-${dpDay.inCurrentMonth}`}
            className="overflow-auto"
          >
            <DailyTaskList day={dpDay} tasks={tasks} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const DailyTaskList = ({
  tasks,
  day,
}: {
  tasks: (Task & { projectId: string })[] | null | undefined;
  day: DPDay;
}) => {
  return (
    <div
      className={clsx(
        "h-28 rounded-md p-1 text-xs md:text-sm",
        day.now && "bg-gray-200 dark:bg-gray-800"
      )}
    >
      <h3
        className={clsx(
          "font-mono text-sm",
          day.now
            ? "font-bold text-black dark:text-white"
            : "font-light text-gray-500"
        )}
      >
        {day.day}
      </h3>
      {tasks ? (
        <>
          {tasks
            .filter((task) => task.dueDate && sameDay(task.dueDate, day.$date))
            .map((task) => (
              <div
                key={task.id}
                className="my-0.5 w-full rounded-md bg-primary-500/10 p-0.5"
              >
                <TaskCard
                  task={task}
                  projectId={task.projectId}
                  isListItem
                  details={false}
                  showCheckbox={false}
                />
              </div>
            ))}
        </>
      ) : (
        // Fallback/skeleton UI for when data is still loading
        <>
          <div
            className="mb-1 h-10 w-full animate-pulse rounded-md bg-gray-500/50"
            style={{ animationDelay: `${day.day}00ms` }}
          />
          <div
            className="mb-1 h-10 w-full animate-pulse rounded-md bg-gray-500/50"
            style={{ animationDelay: `${day.day}50ms` }}
          />
        </>
      )}
    </div>
  );
};

const sameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();
