import { RemirrorEditor } from "@/components/ui/RemirrorEditor";
import { Spinner } from "@/components/ui/Spinner";
import { graphql } from "@/gql";
import { Task } from "@/gql/graphql";
import { RequireOf, cn, isBetween, shortDateFormat } from "@/lib/utils";
import { differenceInSeconds, isAfter } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ReactNode } from "react";
import { MdArrowBack, MdError, MdStart } from "react-icons/md";
import { useQuery } from "urql";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
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

export const GetTaskQuery = graphql(`
  query getTask($projectId: String!, $taskId: Int!) {
    me {
      id
      project(id: $projectId) {
        id
        task(id: $taskId) {
          id
          name
          description
          parentTaskId
          completed
          dueDate
          projectId
          startDate
          reminders {
            id
            taskId
            time
          }
          subTasks {
            id
            name
            description
            completed
            priority
            createdAt
            updatedAt
            startDate
            dueDate
            sectionId
            parentTaskId
            ownerId
            projectId
          }
          parentTask {
            id
            name
          }
        }
      }
    }
  }
`);

export const TaskModal = <
  T extends Omit<
    RequireOf<Task, "id" | "name" | "projectId" | "startDate" | "dueDate">,
    "section" | "project" | "parentTask" | "subTasks" | "reminders"
  >
>({
  modalShown,
  setModalShown,
  task,
  setTask,
  isSaving,
  children,
}: {
  modalShown: boolean;
  setModalShown: (shown: boolean) => void;
  task: T;
  setTask: (task: T) => void;
  isSaving: boolean;
  children?: ReactNode;
}) => {
  const [{ data, fetching }] = useQuery({
    query: GetTaskQuery,
    variables: { taskId: parseInt(task.id!), projectId: task.projectId },
    pause: !modalShown,
  });
  const fullTask = data?.me?.project?.task;

  return (
    <Sheet open={modalShown} onOpenChange={setModalShown}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="max-w-screen w-screen overflow-y-auto sm:w-[40rem] sm:max-w-[initial]">
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
              onCheckedChange={(checked) => {
                setTask({ ...task, completed: checked === true });
                if (checked === true) {
                  setModalShown(false);
                }
              }}
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
            initialContent={task.description ?? ""}
            setContent={(content) => {
              if (content !== task.description) {
                setTask({ ...task, description: content });
              }
            }}
          />

          <section>
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
                      !task.completed &&
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
          </section>

          <section>
            <h2 className="font-bold">Reminders</h2>
            <p className="mb-2 text-sm text-muted-foreground">
              Schedule a notification linking to this task.
            </p>
            <Reminders
              task={task}
              initialReminders={fullTask?.reminders}
              dueDate={task.dueDate}
            />
          </section>

          {task.startDate &&
            task.dueDate &&
            isBetween(new Date(), task.startDate, task.dueDate) && (
              <section>
                <h2 className="font-bold">Expected Progress</h2>
                <p className="mb-2 text-sm text-muted-foreground">
                  Based on the current date and this task&apos;s start and due
                  dates.
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-4">
                    {Math.round(
                      (100 * differenceInSeconds(new Date(), task.startDate)) /
                        differenceInSeconds(task.dueDate, task.startDate)
                    )}
                    %
                  </span>
                  <Progress
                    value={
                      ((new Date().getTime() - task.startDate.getTime()) /
                        (task.dueDate.getTime() - task.startDate.getTime())) *
                      100
                    }
                  />
                </div>
              </section>
            )}

          <section>
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
                <div className="grid gap-2">
                  {fullTask.subTasks.map((task) => (
                    <TaskCard
                      task={{
                        ...task,
                        dueDate: task.dueDate ?? null,
                        startDate: task.startDate ?? null,
                      }}
                      key={task.id}
                      isListItem
                    />
                  ))}

                  <AddSubtask
                    projectId={task.projectId}
                    parentTaskId={parseInt(task.id)}
                  />
                </div>
              </>
            ) : fetching ? (
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
