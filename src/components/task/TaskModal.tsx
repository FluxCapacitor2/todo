import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { Task } from "@prisma/client";
import { PopoverClose } from "@radix-ui/react-popover";
import { addDays, differenceInSeconds, format, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ReactNode } from "react";
import { GrTextAlignFull } from "react-icons/gr";
import { MdArrowBack, MdError, MdRunCircle, MdStart } from "react-icons/md";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
      <SheetContent className="max-w-screen overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
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
              className="inline-block h-5 w-5"
            />
            <div className="w-full pr-4">
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
                className={cn(task.completed && "text-gray-500 line-through")}
                defaultValue={task.name}
              />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-8">
          <div className="grid w-full grid-cols-1 lg:grid-cols-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !task.startDate && "text-muted-foreground"
                  )}
                >
                  <MdStart className="mr-2 h-4 w-4" />
                  {task.startDate ? (
                    <span>Started {format(task.startDate, "PPP")}</span>
                  ) : (
                    <span>Add start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={task.startDate ?? undefined}
                    onSelect={(date) =>
                      setTask({ ...task, startDate: date ?? null })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => setTask({ ...task, startDate: null })}
                  >
                    Remove Date
                  </Button>
                  <PopoverClose asChild>
                    <Button variant="outline">Close</Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !task.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.dueDate ? (
                    <span>Due {format(task.dueDate, "PPP")}</span>
                  ) : (
                    <span>Add due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) =>
                    setTask({
                      ...task,
                      dueDate: addDays(new Date(), parseInt(value)),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
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
                    selected={task.dueDate ?? undefined}
                    onSelect={(date) =>
                      setTask({ ...task, dueDate: date ?? null })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => setTask({ ...task, dueDate: null })}
                  >
                    Remove Date
                  </Button>
                  <PopoverClose asChild>
                    <Button variant="outline">Close</Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
