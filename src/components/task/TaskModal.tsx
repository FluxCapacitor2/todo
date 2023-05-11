import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Task } from "@prisma/client";
import {
  MdArrowBack,
  MdDateRange,
  MdPerson,
  MdStart,
  MdWork,
} from "react-icons/md";
import { DatePickerPopover } from "@/app/project/[id]/DatePickerPopover";
import { TaskCard, format } from "./TaskCard";
import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Button } from "@/components/ui/Button";
import { trpc } from "@/util/trpc/trpc";
import { AddSubtask } from "./AddTask";
import clsx from "clsx";
import { TextField } from "../ui/TextField";

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

  return (
    <CustomDialog opened={modalShown} close={() => setModalShown(false)}>
      {fullTask?.parentTask?.name && (
        <a
          className="font-medium flex gap-2 items-center"
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
          type="checkbox"
          onChange={(e) => setTask({ ...task, completed: e.target.checked })}
          checked={task.completed}
          className="w-6 h-6"
        />
        <TextField
          flat
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className={clsx(task.completed && "text-gray-500 line-through")}
        />
      </DialogTitle>
      <div className="mt-4 mb-6 max-h-96 overflow-scroll outline-none">
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

      <div className="flex gap-2 items-center">
        <MdStart className="w-5 h-5 self-center" />
        <DatePickerPopover
          date={task.startDate}
          setDate={(date) => setTask({ ...task, startDate: date })}
        >
          Started {format.format(task.startDate)}
        </DatePickerPopover>
      </div>
      <div className="flex gap-2 items-center">
        <MdDateRange className="w-5 h-5 self-center" />
        <DatePickerPopover
          allow={(date) => date.getTime() > task.startDate.getTime()}
          date={task.dueDate}
          setDate={(date) => setTask({ ...task, dueDate: date })}
        >
          {task.dueDate ? (
            <>Due {format.format(task.dueDate)}</>
          ) : (
            <>Add Due Date</>
          )}
        </DatePickerPopover>
      </div>

      <div className="flex gap-2 items-center">
        <MdPerson className="w-5 h-5 self-center" />
        You
      </div>

      {task.dueDate && new Date().getTime() < task.dueDate.getTime() && (
        <>
          <hr className="my-6" />
          <div className="flex gap-2 items-center justify-between">
            <span className="flex gap-3 items-center">
              <MdWork />
              Expected Progress:{" "}
              {Math.round(
                (100 * (new Date().getTime() - task.startDate.getTime())) /
                  (task.dueDate.getTime() - task.startDate.getTime())
              )}
              %
            </span>
            <progress
              className="rounded-full h-2"
              value={
                (new Date().getTime() - task.startDate.getTime()) /
                (task.dueDate.getTime() - task.startDate.getTime())
              }
            />
          </div>
        </>
      )}

      <hr className="my-6" />

      {fullTask?.subTasks ? (
        <>
          <h2 className="text-xl font-bold">Sub-tasks</h2>
          {fullTask?.subTasks?.length > 0 && (
            <p>
              {fullTask.subTasks.filter((it) => it.completed).length} /{" "}
              {fullTask.subTasks.length} completed
            </p>
          )}
          <div className="flex flex-col gap-4 mt-4">
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
        "Failed to load sub-tasks."
      )}

      <hr className="my-6" />

      <div className="flex justify-end">
        <Button variant="flat" onClick={() => setModalShown(false)}>
          Close
        </Button>
      </div>

      {isSaving && (
        <div className="flex gap-2 items-center text-gray-500 absolute bottom-2">
          <Spinner /> Saving...
        </div>
      )}
    </CustomDialog>
  );
};
