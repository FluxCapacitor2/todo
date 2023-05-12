import { MouseEvent, useState } from "react";
import { useDatePicker } from "@rehookify/datepicker";
import { Button } from "@/components/ui/Button";
import { MdArrowBack, MdArrowForward, MdCancel, MdCheck } from "react-icons/md";
import clsx from "clsx";

const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export const DatePicker = ({
  date,
  close,
  confirm,
  allow = () => true,
}: {
  date?: Date;
  close: () => void;
  confirm: (date: Date) => void;
  allow?: (date: Date) => boolean;
}) => {
  const [selectedDates, onDatesChange] = useState<Date[]>([date ?? new Date()]);
  const {
    data: { weekDays, calendars },
    propGetters: { dayButton, previousMonthButton, nextMonthButton },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
  });

  // calendars[0] is always present, this is an initial calendar
  const { year, month, days } = calendars[0];

  const onDayClick = (evt: MouseEvent<HTMLElement>, date: Date) => {
    // In case you need any action with evt
    evt.stopPropagation();

    // In case you need any additional action with date
    console.log(date);
  };

  // selectedDates is an array of dates
  // formatted with date.toLocaleDateString(locale, options)
  return (
    <section className="w-80">
      <header>
        <div className="flex items-center justify-between">
          <Button variant="subtle" {...previousMonthButton()}>
            <MdArrowBack />
          </Button>
          <div>
            <p className="text-xl font-bold">
              {month} {year}
            </p>
            <p className="text-center text-sm">
              {selectedDates.length > 0
                ? format.format(selectedDates[0])
                : "Select a Date"}
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
            <Button
              variant={
                dpDay.now ? "subtle" : dpDay.selected ? "primary" : "flat"
              }
              className={clsx(!dpDay.inCurrentMonth && "text-gray-500")}
              {...dayButton(dpDay, {
                onClick: onDayClick,
                disabled: !allow(dpDay.$date),
              })}
            >
              {dpDay.day}
            </Button>
          </li>
        ))}
      </ul>
      <footer className="flex justify-end gap-2">
        <Button variant="subtle" onClickCapture={close}>
          <MdCancel />
          Cancel
        </Button>
        <Button
          variant="primary"
          onClickCapture={() => confirm(selectedDates[0])}
        >
          <MdCheck />
          Confirm
        </Button>
      </footer>
    </section>
  );
};
