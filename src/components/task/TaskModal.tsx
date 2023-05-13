import { DatePickerPopover } from "@/app/project/[id]/DatePickerPopover";
import { Button } from "@/components/ui/Button";
import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
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
import {
  MdArrowBack,
  MdDateRange,
  MdError,
  MdRunCircle,
  MdStart,
} from "react-icons/md";
import { TextField } from "../ui/TextField";
import { AddSubtask } from "./AddTask";
import { TaskCard } from "./TaskCard";

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
        <input
          ref={checkboxRef}
          type="checkbox"
          onChange={(e) => setTask({ ...task, completed: e.target.checked })}
          checked={task.completed}
          className="h-6 w-6"
        />
        <TextField
          flat
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className={clsx(task.completed && "text-gray-500 line-through")}
        />
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

        {/* <div className="flex items-center gap-2">
          <MdPerson className="h-5 w-5 self-center" />
          You
        </div> */}

        {task.startDate &&
          task.dueDate &&
          isBefore(new Date(), task.startDate) && (
            <>
              <div className="flex items-center justify-between gap-2">
                {isBefore(task.startDate, new Date()) && (
                  <>
                    <span className="flex items-center gap-3">
                      <MdRunCircle />
                      Expected Progress:{" "}
                      {Math.round(
                        (100 *
                          differenceInSeconds(new Date(), task.startDate)) /
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
                  </>
                )}
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
