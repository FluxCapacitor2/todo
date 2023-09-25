import { graphql } from "@/gql";
import { Task } from "@/gql/graphql";
import { RequireOf, cn, shortDateFormat } from "@/lib/utils";
import clsx from "clsx";
import { isAfter } from "date-fns";
import { useState } from "react";
import {
  MdCalendarToday,
  MdDelete,
  MdRemoveCircle,
  MdToday,
} from "react-icons/md";
import { useMutation } from "urql";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TaskModal } from "./TaskModal";
import { TaskProvider } from "./TaskProvider";

export const TaskCard = ({
  task: inTask,
  isListItem,
  details,
  showCheckbox = true,
  readonly = false,
}: {
  task: Omit<
    RequireOf<
      Task,
      | "id"
      | "dueDate"
      | "createdAt"
      | "completed"
      | "description"
      | "name"
      | "projectId"
      | "startDate"
    >,
    "section" | "project"
  >;
  isListItem?: boolean;
  details?: boolean;
  showCheckbox?: boolean;
  readonly?: boolean;
}) => {
  const [modalShown, setModalShown] = useState(false);

  return (
    <TaskProvider task={inTask}>
      {({ task, setTask, isSaving }) => (
        <TaskModal
          {...{
            modalShown: modalShown && !readonly,
            setModalShown,
            task,
            setTask,
            isSaving,
          }}
        >
          <div onClick={() => setModalShown(true)} role="button">
            <ContextMenu>
              <ContextMenuTrigger
                asChild
                disabled={readonly}
                className={clsx(
                  readonly && "pointer-events-none cursor-not-allowed"
                )}
              >
                <Card>
                  <CardContent className="p-4 py-2">
                    <div className="flex gap-2">
                      {showCheckbox && (
                        <div className="grid h-6 items-center">
                          <Checkbox
                            onCheckedChange={(checked) => {
                              setTask({ ...task, completed: checked === true });
                            }}
                            checked={task.completed}
                            onClick={(e) => e.stopPropagation()}
                            disabled={readonly}
                          />
                        </div>
                      )}
                      <h3
                        className={cn(
                          "line-clamp-2 font-semibold",
                          task.completed && "text-gray-500 line-through"
                        )}
                      >
                        {task.name}
                      </h3>
                    </div>
                    {details && (
                      <div className="mt-2 flex flex-col gap-2">
                        {task.description && (
                          <Card className="w-full resize-none text-sm text-muted-foreground">
                            <CardContent
                              className={cn(
                                "overflow-hidden py-2",
                                isListItem ? "line-clamp-1" : "line-clamp-2"
                              )}
                            >
                              {task.description}
                            </CardContent>
                          </Card>
                        )}
                        {task.dueDate && (
                          <DatePickerPopover
                            date={task.dueDate}
                            setDate={(date) =>
                              setTask({ ...task, dueDate: date })
                            }
                          >
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              variant={"outline"}
                              disabled={readonly}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !task.dueDate && "text-muted-foreground",
                                task.dueDate &&
                                  !task.completed &&
                                  isAfter(new Date(), task.dueDate) &&
                                  "text-destructive"
                              )}
                            >
                              <MdCalendarToday className="mr-2 h-4 w-4" />
                              {task.dueDate ? (
                                <>Due {shortDateFormat(task.dueDate)}</>
                              ) : (
                                "Add Due Date"
                              )}
                            </Button>
                          </DatePickerPopover>
                        )}
                      </div>
                    )}

                    {/* TODO: re-implement once subTask counts can be optimized */}
                    {/* {!!task.subTaskCounts && (
                      <div className="mt-2 flex items-center gap-2">
                        <MdCheckCircleOutline />
                        <p className="text-sm">{task.subTaskCounts}</p>
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent onClick={(e) => e.stopPropagation()}>
                <TaskContextMenuItems
                  task={task}
                  setTask={setTask}
                  readonly={readonly}
                />
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </TaskModal>
      )}
    </TaskProvider>
  );
};

const DeleteTaskMutation = graphql(`
  mutation deleteTask($id: Int!) {
    deleteTask(id: $id) {
      id
    }
  }
`);

const TaskContextMenuItems = <T extends Partial<Task>>({
  task,
  setTask,
  readonly = false,
}: {
  task: T;
  setTask: (task: T) => void;
  readonly?: boolean;
}) => {
  const [_deleteTaskStatus, deleteTask] = useMutation(DeleteTaskMutation);

  return (
    <>
      <ContextMenuItem
        onClick={() => deleteTask({ id: parseInt(task.id!) })}
        disabled={readonly || !task.id}
      >
        <MdDelete /> Delete Task
      </ContextMenuItem>
      {task.dueDate && (
        <ContextMenuItem
          onClick={() => setTask({ ...task, dueDate: null })}
          disabled={readonly}
        >
          <MdToday /> Remove Due Date
        </ContextMenuItem>
      )}
      {task.startDate && (
        <ContextMenuItem
          onClick={() => setTask({ ...task, startDate: null })}
          disabled={readonly}
        >
          <MdRemoveCircle /> Remove Start Date
        </ContextMenuItem>
      )}
    </>
  );
};
