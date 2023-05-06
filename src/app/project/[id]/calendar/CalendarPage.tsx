"use client";

import { Button } from "@/components/Button";
import { Project, Section, Task } from "@prisma/client";
import { CalendarDay, useDatePicker } from "@rehookify/datepicker";
import { Fragment, MouseEvent, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCancel, MdCheck } from "react-icons/md";
import { TaskCard } from "../TaskCard";
import { Spinner } from "@/components/Spinner";
import { trpc } from "@/util/trpc/trpc";

export const CalendarPage = ({
  project,
}: {
  project: Project & { sections: (Section & { tasks: Task[] })[] };
}) => {
  const [selectedDates, onDatesChange] = useState<Date[]>([new Date()]);
  const {
    data: { weekDays, calendars },
    propGetters: { previousMonthButton, nextMonthButton },
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

  const onDayClick = (evt: MouseEvent<HTMLElement>, date: Date) => {
    evt.stopPropagation();

    console.log(date);
  };

  return (
    <section className="max-w-6xl mx-auto m-4">
      <header>
        <div className="flex justify-between items-center mb-6">
          <Button variant="subtle" {...previousMonthButton()}>
            <MdArrowBack />
          </Button>
          <div>
            <p className="text-xl font-bold">
              {month} {year}
            </p>
          </div>
          <Button variant="subtle" {...nextMonthButton()}>
            <MdArrowForward />
          </Button>
        </div>
        <ul className="grid grid-cols-7">
          {weekDays.map((day) => (
            <li key={`${month}-${day}`}>{day}</li>
          ))}
        </ul>
      </header>
      <ul className="grid grid-cols-7">
        {days.map((dpDay) => (
          <li key={`${year}-${month}-${dpDay.day}-${dpDay.inCurrentMonth}`}>
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
    <div className="py-2">
      <h3 className="text-xl font-light text-gray-500">{day.day}</h3>
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
