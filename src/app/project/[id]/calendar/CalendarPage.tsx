"use client";

import { Button } from "@/components/ui/Button";
import { Project, Section, Task } from "@prisma/client";
import { CalendarDay, useDatePicker } from "@rehookify/datepicker";
import { Fragment, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCalendarToday } from "react-icons/md";
import { TaskCard } from "@/components/task/TaskCard";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";

export const CalendarPage = ({
  project,
}: {
  project: Project & { sections: (Section & { tasks: Task[] })[] };
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

  const { data } = trpc.projects.get.useQuery(project.id, {
    initialData: project,
  });

  if (!data) {
    return <Spinner />;
  }

  const { year, month, days } = calendars[0];

  return (
    <section className="px-4 mx-auto m-4">
      <header>
        <div className="flex flex-col items-center gap-4 mb-6">
          <p className="text-3xl -mt-12 font-bold">
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
        <ul className="grid grid-cols-7">
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
            <DailyTaskList day={dpDay} project={data} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const DailyTaskList = ({
  project,
  day,
}: {
  project: Project & { sections: (Section & { tasks: Task[] })[] };
  day: CalendarDay;
}) => {
  return (
    <div className={clsx("py-2 h-28", day.now && "bg-gray-200")}>
      <h3
        className={clsx(
          "text-sm font-mono",
          day.now
            ? "text-black dark:text-white font-bold"
            : "text-gray-500 font-light"
        )}
      >
        {day.day}
      </h3>
      {project.sections.map((section) => (
        <Fragment key={section.id}>
          {section.tasks
            .filter((task) => task.dueDate && sameDay(task.dueDate, day.$date))
            .map((task) => (
              <TaskCard
                task={task}
                key={task.id}
                projectId={project.id}
                isListItem
                details={false}
              />
            ))}
        </Fragment>
      ))}
    </div>
  );
};

const sameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();
