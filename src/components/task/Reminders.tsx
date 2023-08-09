import { useAddReminder, useRemoveReminder } from "@/hooks/reminder";
import { shortDateFormat } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { useState } from "react";
import { MdClose, MdNotificationAdd, MdNotifications } from "react-icons/md";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const Reminders = ({
  task,
  dueDate,
}: {
  task: Task;
  dueDate: Date | null;
}) => {
  const { data: reminders } = trpc.notification.list.useQuery(task.id, {
    enabled: task.id > 0,
    refetchInterval: 120_000,
  });

  const { addReminder } = useAddReminder(task);
  const { removeReminder } = useRemoveReminder(task);

  return (
    <div className="flex flex-col gap-2">
      <AddReminder add={(time) => addReminder({ taskId: task.id, time })} />
      {reminders?.map((reminder) => (
        <Card key={reminder.id}>
          <CardContent className="flex items-center px-4 py-2">
            <MdNotifications className="mr-2 inline h-4 w-4" />
            <p>{shortDateFormat(reminder.time)}</p>
            <div className="grow" />
            <button
              onClick={() => removeReminder(reminder.id)}
              disabled={reminder.id < 0}
            >
              <span className="sr-only">Remove reminder</span>
              <MdClose />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AddReminder = ({ add }: { add: (date: Date) => void }) => {
  const [date, setDate] = useState<Date>(new Date(Date.now() + 86_400_000));

  return (
    <DatePickerPopover date={date} setDate={setDate}>
      <Button
        variant={"outline"}
        className="w-full justify-start text-left font-normal text-muted-foreground"
      >
        <MdNotificationAdd className="mr-2 h-4 w-4" />
        Add Reminder
      </Button>
    </DatePickerPopover>
  );
};
