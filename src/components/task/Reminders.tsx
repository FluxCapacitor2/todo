import { graphql } from "@/gql";
import { Reminder, Task } from "@/gql/graphql";
import { RequireOf, shortDateFormat } from "@/lib/utils";
import { MdClose, MdNotificationAdd, MdNotifications } from "react-icons/md";
import { useMutation } from "urql";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const CreateReminderMutation = graphql(`
  mutation createReminder($taskId: Int!, $time: DateTime!) {
    createReminder(taskId: $taskId, time: $time) {
      taskId
      id
      time
    }
  }
`);

const DeleteReminderMutation = graphql(`
  mutation deleteReminder($id: Int!) {
    deleteReminder(id: $id) {
      taskId
      id
      time
    }
  }
`);

export const Reminders = ({
  task,
  initialReminders: reminders,
  dueDate,
}: {
  task: RequireOf<Task, "id" | "projectId">;
  initialReminders: Pick<Reminder, "id" | "time">[] | undefined;
  dueDate: Date | null | undefined;
}) => {
  const [addReminderStatus, addReminder] = useMutation(CreateReminderMutation);
  const [deleteReminderStatus, deleteReminder] = useMutation(
    DeleteReminderMutation
  );

  return (
    <div className="flex flex-col gap-2">
      <AddReminder
        add={(time) => addReminder({ taskId: parseInt(task.id), time })}
      />
      {reminders?.map((reminder) => (
        <Card key={reminder.id}>
          <CardContent className="flex items-center px-4 py-2">
            <MdNotifications className="mr-2 inline h-4 w-4" />
            <p>{shortDateFormat(reminder.time)}</p>
            <div className="grow" />
            <button
              onClick={() => deleteReminder({ id: parseInt(reminder.id) })}
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
  return (
    <DatePickerPopover
      date={new Date(Date.now() + 86_400_000)}
      setDate={(date) => date && add(date)}
    >
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
