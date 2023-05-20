import { Button } from "@/components/ui/Button";
import { useDatePicker } from "@rehookify/datepicker";
import clsx from "clsx";
import { setHours, setMinutes } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCheck } from "react-icons/md";
import { TextField } from "./TextField";

const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export const DatePicker = ({
  date,
  close,
  confirm,
  minDate,
  maxDate,
}: {
  date?: Date;
  close: () => void;
  confirm: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const [selectedDates, onDatesChange] = useState<Date[]>([date ?? new Date()]);
  const {
    data: { weekDays, calendars, time },
    propGetters: { dayButton, previousMonthButton, nextMonthButton },
  } = useDatePicker({
    selectedDates,
    onDatesChange,
    dates: {
      minDate,
      maxDate,
      limit: 1,
      mode: "single",
    },
  });

  useEffect(() => {
    const [hours, minutes] = [
      selectedDates[0].getHours(),
      selectedDates[0].getMinutes(),
    ];
    setIsPM(hours >= 12);
    if (hourField.current) {
      if (hours % 12 === 0) {
        hourField.current.valueAsNumber = 12;
      } else {
        hourField.current.valueAsNumber = hours % 12;
      }
    }
    if (minuteField.current) {
      minuteField.current.value = minutes.toString().padStart(2, "0");
    }
  }, [selectedDates]);

  // calendars[0] is always present, this is an initial calendar
  const { year, month, days } = calendars[0];

  const [isPM, setIsPM] = useState(false);
  const hourField = useRef<HTMLInputElement | null>(null);
  const minuteField = useRef<HTMLInputElement | null>(null);

  // selectedDates is an array of dates
  // formatted with date.toLocaleDateString(locale, options)
  return (
    <section className="w-80" onClick={(e) => e.stopPropagation()}>
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
                dpDay.selected ? "primary" : dpDay.now ? "subtle" : "flat"
              }
              className={clsx(!dpDay.inCurrentMonth && "text-gray-500")}
              {...dayButton(dpDay, {
                onClick(evt, date) {
                  console.log(evt, date);
                  evt?.stopPropagation();
                },
              })}
            >
              {dpDay.day}
            </Button>
          </li>
        ))}
      </ul>
      {selectedDates[0] && (
        <div className="mb-6 mt-4 flex justify-between gap-2">
          <TextField
            className="w-12 appearance-textfield"
            placeholder="12"
            ref={hourField}
            type="number"
            min={0}
            max={12}
          />
          <TextField
            className="w-12 appearance-textfield"
            placeholder="00"
            ref={minuteField}
            type="number"
            min={0}
            max={60}
          />
          <Button
            variant="flat"
            className="h-10 w-12 rounded-md border border-b-4 border-gray-300 p-3 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-primary-700"
            onClick={() => setIsPM(!isPM)}
          >
            {isPM ? "PM" : "AM"}
          </Button>
          <Button
            variant="primary"
            onClickCapture={(e) => {
              e.stopPropagation();

              const date = selectedDates[0];
              let hour = hourField.current!.valueAsNumber;
              const minute = minuteField.current!.valueAsNumber;

              if (hour === 12) {
                hour = 0;
              }

              console.log(
                hourField.current?.valueAsNumber,
                minuteField.current?.valueAsNumber
              );

              const final = setHours(
                setMinutes(date, isNaN(minute) ? 0 : minute),
                isNaN(hour) ? 0 : hour + (isPM ? 12 : 0)
              );

              console.log(final, date, hour, minute);

              confirm(final);
            }}
          >
            <MdCheck />
            Confirm
          </Button>
        </div>
      )}
    </section>
  );
};
