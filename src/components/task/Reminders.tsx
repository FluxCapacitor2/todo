import { LONG_DATE_FORMAT } from "@/util/constants";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import toast from "react-hot-toast";
import { MdClose, MdNotificationAdd, MdNotifications } from "react-icons/md";
import { DatePickerPopover } from "../ui/DatePickerPopover";

export const Reminders = ({
  taskId,
  projectId,
  dueDate,
}: {
  taskId: number;
  projectId: string;
  dueDate: Date | null;
}) => {
  const utils = trpc.useContext();
  const { data: reminders } = trpc.notification.list.useQuery(taskId);

  const { mutateAsync: _addReminder } = trpc.notification.add.useMutation({
    onMutate: ({ projectId, taskId, time }) => {
      utils.notification.list.cancel(taskId);
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
      utils.notification.list.setData(taskId, (list) => {
        if (!list) return undefined;
        return [...list, { id: newId, projectId, taskId, time }];
      });
      return { newId };
    },
    onError: (error, { taskId }, context) => {
      toast.error("There was an error adding a reminder!");
      if (!context) return;
      utils.notification.list.setData(taskId, (list) => {
        if (!list) return undefined;
        return list.filter((item) => item.id !== context?.newId);
      });
    },
    onSettled: () => {
      utils.notification.list.invalidate(taskId);
    },
  });

  const addReminder = ({ taskId, time }: { taskId: number; time: Date }) => {
    if (time.getTime() < new Date().getTime()) {
      toast.error("You must set the reminder for a time in the future!");
    } else {
      _addReminder({ taskId, projectId, time });
    }
  };

  const { mutateAsync: removeReminder } = trpc.notification.remove.useMutation({
    onMutate: (id) => {
      const reminder = utils.notification.list
        .getData()
        ?.find((it) => it.id === id);

      utils.notification.list.cancel(taskId);
      utils.notification.list.setData(taskId, (list) => {
        return list?.filter((item) => item.id !== id);
      });

      return reminder;
    },
    onError: (error, id, context) => {
      toast.error("There was an error removing that reminder!");
      if (!context) return;

      utils.notification.list.setData(taskId, (list) => {
        if (!list) return undefined;
        return [...list, context];
      });
    },
    onSettled: () => {
      utils.notification.list.invalidate(taskId);
    },
  });

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
          <MdNotifications />
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

      <div className="flex items-center gap-2">
        <MdNotificationAdd />
        Add Reminder:
      </div>
      <div className="ml-6 flex flex-wrap gap-4">
        {dueDate && (
          <>
            <Reminder
              addReminder={addReminder}
              date={new Date(dueDate.getTime() - 1000 * 60 * 30)}
              taskId={taskId}
            >
              30 minutes before
            </Reminder>
            <Reminder
              addReminder={addReminder}
              date={new Date(dueDate.getTime() - 1000 * 60 * 60)}
              taskId={taskId}
            >
              1 hour before
            </Reminder>
            <Reminder
              addReminder={addReminder}
              date={new Date(dueDate.getTime() - 1000 * 60 * 60)}
              taskId={taskId}
            >
              1 day before
            </Reminder>
          </>
        )}
        <DatePickerPopover
          minDate={new Date()}
          setDate={(date) => {
            addReminder({
              time: date,
              taskId,
            });
          }}
        >
          <span className="font-medium underline">Custom Time...</span>
        </DatePickerPopover>
      </div>
    </div>
  );
};

const Reminder = ({
  addReminder,
  taskId,
  date,
  children,
}: {
  addReminder: ({ taskId, time }: { taskId: number; time: Date }) => void;
  taskId: number;
  date: Date;
  children: string;
}) => {
  const passed = isAfter(new Date(), date);
  if (passed) return null;
  return (
    <p
      className="cursor-pointer font-medium underline"
      onClick={() =>
        addReminder({
          taskId,
          time: date,
        })
      }
    >
      {children}
    </p>
  );
};
