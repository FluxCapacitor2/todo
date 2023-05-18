import { Button } from "@/components/ui/Button";
import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
import { DatePickerPopover } from "@/components/ui/DatePickerPopover";
import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import clsx from "clsx";
import {
  differenceInSeconds,
  format,
  formatDistanceToNow,
  isBefore,
} from "date-fns";
import { useRef } from "react";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdClose,
  MdDateRange,
  MdError,
  MdNotificationAdd,
  MdNotifications,
  MdRunCircle,
  MdStart,
} from "react-icons/md";
import { AddSubtask } from "./AddTask";
import { TaskCard, TaskMenuButton } from "./TaskCard";

export const TaskModal = ({
  modalShown,
  setModalShown,
  task,
  setTask,
  projectId,
  isSaving,
}: {
  modalShown: boolean;
  setModalShown: (shown: boolean) => void;
  task: Task;
  setTask: (task: Task) => void;
  projectId: string;
  isSaving: boolean;
}) => {
  const { data: fullTask, isLoading: loadingSubTasks } =
    trpc.tasks.get.useQuery({ id: task.id }, { enabled: modalShown });

  const checkboxRef = useRef<HTMLInputElement | null>(null);

  return (
    <CustomDialog
      opened={modalShown}
      close={() => setModalShown(false)}
      initialFocus={checkboxRef}
    >
      {fullTask?.parentTask?.name && (
        <a
          className="flex items-center gap-2 font-medium"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setModalShown(false);
          }}
        >
          <MdArrowBack />
          {fullTask.parentTask.name}
        </a>
      )}
      <DialogTitle>
        <div className="self-start">
          <input
            ref={checkboxRef}
            type="checkbox"
            onChange={(e) => setTask({ ...task, completed: e.target.checked })}
            checked={task.completed}
            className="h-6 w-6"
          />
        </div>
        <div
          contentEditable
          onBlur={(e) =>
            setTask({ ...task, name: e.currentTarget.textContent ?? "" })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className={clsx(
            "w-full",
            task.completed && "text-gray-500 line-through"
          )}
          spellCheck={false}
          suppressContentEditableWarning // The warning does not apply; we expect that this text gets edited
        >
          {task.name}
        </div>
      </DialogTitle>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MdStart className="h-5 w-5 self-center" />
          <DatePickerPopover
            date={task.startDate ?? undefined}
            maxDate={task.dueDate ?? undefined}
            setDate={(date) => setTask({ ...task, startDate: date })}
          >
            {task.startDate ? (
              <>
                Started {format(task.startDate, "MMM dd, yyyy")}{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  ({formatDistanceToNow(task.startDate, { addSuffix: true })})
                </span>
              </>
            ) : (
              <>Add Start Date</>
            )}
          </DatePickerPopover>
        </div>
        <div className="flex items-center gap-2">
          <MdDateRange className="h-5 w-5 self-center" />
          <DatePickerPopover
            minDate={task.startDate ?? undefined}
            date={task.dueDate ?? undefined}
            setDate={(date) => setTask({ ...task, dueDate: date })}
          >
            {task.dueDate ? (
              <>
                Due {format(task.dueDate, "MMM dd, yyyy")}{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  ({formatDistanceToNow(task.dueDate, { addSuffix: true })})
                </span>
              </>
            ) : (
              <>Add Due Date</>
            )}
          </DatePickerPopover>
        </div>
        <Reminders
          taskId={task.id}
          dueDate={task.dueDate}
          projectId={projectId}
        />

        {/* <div className="flex items-center gap-2">
          <MdPerson className="h-5 w-5 self-center" />
          You
        </div> */}

        {task.startDate &&
          task.dueDate &&
          isBefore(task.startDate, new Date()) &&
          isBefore(new Date(), task.dueDate) && (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-3">
                  <MdRunCircle />
                  Expected Progress:{" "}
                  {Math.round(
                    (100 * differenceInSeconds(new Date(), task.startDate)) /
                      differenceInSeconds(task.dueDate, task.startDate)
                  )}
                  %
                </span>
                <progress
                  className="h-2 rounded-full"
                  value={
                    (new Date().getTime() - task.startDate.getTime()) /
                    (task.dueDate.getTime() - task.startDate.getTime())
                  }
                />
              </div>
            </>
          )}

        <div className="mb-6 mt-4 max-h-96 overflow-scroll outline-none">
          <RemirrorEditor
            editable={!isSaving}
            initialContent={task.description}
            setContent={(content) => {
              if (content !== task.description) {
                setTask({ ...task, description: content });
              }
            }}
          />
        </div>

        {fullTask?.subTasks ? (
          <>
            <h2 className="text-xl font-bold">Sub-tasks</h2>
            {fullTask?.subTasks?.length > 0 && (
              <p>
                {fullTask.subTasks.filter((it) => it.completed).length} /{" "}
                {fullTask.subTasks.length} completed
              </p>
            )}
            <div className="mt-4 flex flex-col gap-4">
              {fullTask.subTasks.map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  projectId={projectId}
                  isListItem
                />
              ))}
              <AddSubtask projectId={projectId} parentTaskId={task.id} />
            </div>
          </>
        ) : loadingSubTasks ? (
          <Spinner />
        ) : (
          <div className="flex items-center gap-2">
            <MdError />
            Failed to load sub-tasks.
          </div>
        )}

        <div className="flex justify-between">
          <TaskMenuButton
            task={task}
            setTask={setTask}
            projectId={projectId}
            hover={false}
          />
          <Button variant="flat" onClick={() => setModalShown(false)}>
            Close
          </Button>
        </div>
      </div>

      {isSaving && (
        <div className="absolute bottom-2 flex items-center gap-2 text-gray-500">
          <Spinner /> Saving...
        </div>
      )}
    </CustomDialog>
  );
};

const Reminders = ({
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
        <div className="flex items-center gap-2" key={reminder.id}>
          <MdNotifications />
          {format(reminder.time, "MMM do, h:mm aaa")} (
          {formatDistanceToNow(reminder.time, { addSuffix: true })})
          <button onClick={() => removeReminder(reminder.id)}>
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
            <p
              className="cursor-pointer font-medium underline"
              onClick={() =>
                addReminder({
                  taskId,
                  time: new Date(dueDate.getTime() - 1000 * 60 * 30),
                })
              }
            >
              30 Minutes Before
            </p>
            <p
              className="cursor-pointer font-medium underline"
              onClick={() =>
                addReminder({
                  taskId,
                  time: new Date(dueDate.getTime() - 1000 * 60 * 60),
                })
              }
            >
              1 Hour Before
            </p>
            <p
              className="cursor-pointer font-medium underline"
              onClick={() =>
                addReminder({
                  taskId,
                  time: new Date(dueDate.getTime() - 1000 * 60 * 60 * 24),
                })
              }
            >
              1 Day Before
            </p>
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
          <span className="font-medium underline">Custom Time</span>
        </DatePickerPopover>
      </div>
    </div>
  );
};
