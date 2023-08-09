import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Spinner } from "@/components/ui/Spinner";
import { cn, shortDateFormat } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { differenceInSeconds, isAfter, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ReactNode } from "react";
import { MdArrowBack, MdError, MdRunCircle, MdStart } from "react-icons/md";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AddSubtask } from "./AddTask";
import { Reminders } from "./Reminders";
import { TaskCard } from "./TaskCard";

export const TaskModal = ({
  modalShown,
  setModalShown,
  task,
  setTask,
  isSaving,
  children,
}: {
  modalShown: boolean;
  setModalShown: (shown: boolean) => void;
  task: Task;
  setTask: (task: Task) => void;
  isSaving: boolean;
  children?: ReactNode;
}) => {
  const { data: fullTask, isLoading: loadingSubTasks } =
    trpc.tasks.get.useQuery(
      { id: task.id },
      { enabled: modalShown, refetchInterval: 30_000 }
    );

  return (
    <Sheet open={modalShown} onOpenChange={setModalShown}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="max-w-screen w-screen overflow-y-auto sm:w-auto sm:max-w-2xl">
        <SheetHeader className="-mt-2">
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
          <SheetTitle className="flex items-center gap-1">
            <Checkbox
              onCheckedChange={(checked) =>
                setTask({ ...task, completed: checked === true })
              }
              checked={task.completed}
              className="absolute left-8 inline-block h-5 w-5"
            />
            <Input
              type="text"
              onBlur={(e) => {
                setTask({ ...task, name: e.currentTarget.value ?? "" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                task.completed && "text-gray-500 line-through",
                "mr-4 pl-8"
              )}
              defaultValue={task.name}
            />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 pr-4">
          <RemirrorEditor
            className="mt-2"
            editable={!isSaving}
            initialContent={task.description}
            setContent={(content) => {
              if (content !== task.description) {
                setTask({ ...task, description: content });
              }
            }}
          />

          <div>
            <h2 className="mb-2 font-bold">Dates</h2>
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              <DatePickerPopover
                date={task.startDate}
                setDate={(date) => setTask({ ...task, startDate: date })}
              >
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !task.startDate && "text-muted-foreground"
                  )}
                >
                  <MdStart className="mr-2 h-4 w-4" />
                  {task.startDate ? (
                    <span>Started {shortDateFormat(task.startDate)}</span>
                  ) : (
                    <span>Add start date</span>
                  )}
                </Button>
              </DatePickerPopover>
              <DatePickerPopover
                date={task.dueDate}
                setDate={(date) => setTask({ ...task, dueDate: date })}
              >
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !task.dueDate && "text-muted-foreground",
                    task.dueDate &&
                      isAfter(new Date(), task.dueDate) &&
                      "text-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.dueDate ? (
                    <span>Due {shortDateFormat(task.dueDate)}</span>
                  ) : (
                    <span>Add due date</span>
                  )}
                </Button>
              </DatePickerPopover>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-bold">Reminders</h2>
            <Reminders task={task} dueDate={task.dueDate} />
          </div>

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

          <section className="flex flex-col gap-2">
            <h2 className="mb-2 font-bold">
              Sub-tasks
              {fullTask?.subTasks && fullTask.subTasks.length > 0 && (
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
