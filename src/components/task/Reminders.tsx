import { useAddReminder, useRemoveReminder } from "@/hooks/reminder";
import { cn } from "@/lib/utils";
import { LONG_DATE_FORMAT } from "@/util/constants";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";
import clsx from "clsx";
import { addDays, format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  MdAdd,
  MdClose,
  MdNotificationAdd,
  MdNotifications,
} from "react-icons/md";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const Reminders = ({
  task,
  dueDate,
}: {
  task: Task;
  dueDate: Date | null;
}) => {
  const { data: reminders } = trpc.notification.list.useQuery(task.id, {
    refetchInterval: 120_000,
  });

  const { addReminder } = useAddReminder(task);
  const { removeReminder } = useRemoveReminder(task);

  return (
    <div>
      {reminders?.map((reminder) => (
        <div
          className={clsx(
            "flex items-center gap-2",
            reminder.id < 0 && "pointer-events-none opacity-70"
          )}
          key={reminder.id}
        >
          <MdNotifications className="mr-2 h-5 w-5" />
          {format(reminder.time, LONG_DATE_FORMAT)}{" "}
          <span className="text-gray-600 dark:text-gray-400">
            ({formatDistanceToNow(reminder.time, { addSuffix: true })})
          </span>
          <button
            onClick={() => removeReminder(reminder.id)}
            disabled={reminder.id < 0}
          >
            <MdClose />
          </button>
        </div>
      ))}

      <AddReminder add={(time) => addReminder({ taskId: task.id, time })} />
    </div>
  );
};

const AddReminder = ({ add }: { add: (date: Date) => void }) => {
  const [date, setDate] = useState<Date>(new Date(Date.now() + 86_400_000));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <MdNotificationAdd className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a time..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
          />
        </div>
        <PopoverClose asChild>
          <Button onClick={() => add(date)}>
            <MdAdd /> Add
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};
