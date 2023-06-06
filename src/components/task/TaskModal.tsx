import { Button } from "@/components/ui/Button";
import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
import { DatePickerPopover } from "@/components/ui/DatePickerPopover";
import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Spinner } from "@/components/ui/Spinner";
import { LONG_DATE_FORMAT } from "@/util/constants";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Task } from "@prisma/client";
import clsx from "clsx";
import {
  differenceInSeconds,
  format,
  formatDistanceToNow,
  isBefore,
} from "date-fns";
import { useRef } from "react";
import { GrTextAlignFull } from "react-icons/gr";
import {
  MdArrowBack,
  MdDateRange,
  MdError,
  MdMoreHoriz,
  MdRunCircle,
  MdStart,
} from "react-icons/md";
import { Checkbox } from "../ui/Checkbox";
import { AddSubtask } from "./AddTask";
import { Reminders } from "./Reminders";
import { TaskCard, TaskMenuButton } from "./TaskCard";

export const TaskModal = ({
  modalShown,
  setModalShown,
  task,
  setTask,
  isSaving,
}: {
  modalShown: boolean;
  setModalShown: (shown: boolean) => void;
  task: Task;
  setTask: (task: Task) => void;
  isSaving: boolean;
}) => {
  const { data: fullTask, isLoading: loadingSubTasks } =
    trpc.tasks.get.useQuery(
      { id: task.id },
      { enabled: modalShown, refetchInterval: 30_000 }
    );

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
        <div className="mr-2 self-start">
          <Checkbox
            ref={checkboxRef}
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

      <div className="mt-8 flex flex-col gap-8">
        <TaskMenuButton
          task={task}
          setTask={setTask}
          hover={false}
          button={
            <Menu.Button>
              <div className="flex items-center gap-4">
                <MdMoreHoriz className="h-5 w-5" />
                <span className="hover:underline">Options...</span>
              </div>
            </Menu.Button>
          }
        />

        <div className="flex items-center gap-4">
          <MdStart className="h-5 w-5 self-center" />
          <DatePickerPopover
            date={task.startDate ?? undefined}
            maxDate={task.dueDate ?? undefined}
            setDate={(date) => setTask({ ...task, startDate: date })}
          >
            {task.startDate ? (
              <>
                Started {format(task.startDate, LONG_DATE_FORMAT)}{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  ({formatDistanceToNow(task.startDate, { addSuffix: true })})
                </span>
              </>
            ) : (
              <>Add Start Date</>
            )}
          </DatePickerPopover>
        </div>
        <div className="flex items-center gap-4">
          <MdDateRange className="h-5 w-5 self-center" />
          <DatePickerPopover
            minDate={task.startDate ?? undefined}
            date={task.dueDate ?? undefined}
            setDate={(date) => setTask({ ...task, dueDate: date })}
          >
            {task.dueDate ? (
              <>
                Due {format(task.dueDate, LONG_DATE_FORMAT)}{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  ({formatDistanceToNow(task.dueDate, { addSuffix: true })})
                </span>
              </>
            ) : (
              <>Add Due Date</>
            )}
          </DatePickerPopover>
        </div>
        <Reminders task={task} dueDate={task.dueDate} />

        {task.startDate &&
          task.dueDate &&
          isBefore(task.startDate, new Date()) &&
          isBefore(new Date(), task.dueDate) && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-4">
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

        <div className="flex flex-col">
          <p className="flex items-center gap-4">
            <GrTextAlignFull className="h-5 w-5" /> Description
          </p>
          <div className="mb-6 ml-6 mt-4 max-h-96 w-full overflow-scroll outline-none">
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
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">
            Sub-tasks{" "}
            {fullTask?.subTasks && fullTask.subTasks.length > 0 && (
              <span className="text-base font-normal">
                {fullTask.subTasks.filter((it) => it.completed).length}/
                {fullTask.subTasks.length} completed
              </span>
            )}
          </h2>
          {fullTask?.subTasks ? (
            <>
              <div className="flex flex-col gap-4">
                {fullTask.subTasks.map((task) => (
                  <TaskCard task={task} key={task.id} isListItem />
                ))}
              </div>

              <AddSubtask projectId={task.projectId} parentTaskId={task.id} />
            </>
          ) : loadingSubTasks ? (
            <Spinner />
          ) : (
            <div className="flex items-center gap-2">
              <MdError />
              Failed to load sub-tasks.
            </div>
          )}
        </section>
        <div className="flex justify-end">
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
