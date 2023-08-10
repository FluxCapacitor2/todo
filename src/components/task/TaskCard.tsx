import { useCopyTaskURL, useDeleteTask } from "@/hooks/task";
import { cn, shortDateFormat } from "@/lib/utils";
import { Task } from "@prisma/client";
import { useState } from "react";
import {
  MdCalendarToday,
  MdCheckCircleOutline,
  MdContentCopy,
  MdDelete,
  MdRemoveCircle,
  MdToday,
} from "react-icons/md";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import { RemirrorEditor } from "../ui/RemirrorEditor";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TaskModal } from "./TaskModal";
import { TaskProvider } from "./TaskProvider";

export const TaskCard = ({
  task: inTask,
  isListItem,
  details,
  showCheckbox = true,
}: {
  task: Task;
  isListItem?: boolean;
  details?: boolean;
  showCheckbox?: boolean;
}) => {
  const subTasks =
    "subTasks" in inTask ? (inTask.subTasks as { completed: boolean }[]) : [];

  const [modalShown, setModalShown] = useState(false);

  return (
    <TaskProvider task={inTask}>
      {({ task, setTask, isSaving }) => (
        <TaskModal
          {...{
            modalShown,
            setModalShown,
            task,
            setTask,
            isSaving,
          }}
        >
          <div onClick={() => setModalShown(true)} role="button">
            <ContextMenu>
              <ContextMenuTrigger asChild>
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Card
                                onClick={(e) => e.stopPropagation()}
                                className="w-full resize-none text-sm text-muted-foreground"
                              >
                                <CardContent
                                  className={cn(
                                    "overflow-hidden py-2",
                                    isListItem ? "line-clamp-1" : "line-clamp-2"
                                  )}
                                >
                                  {task.description}
                                </CardContent>
                              </Card>
                            </PopoverTrigger>
                            <PopoverContent
                              onClick={(e) => e.stopPropagation()}
                            >
                              <h3 className="font-bold">Edit Description</h3>
                              <RemirrorEditor
                                editable
                                initialContent={task.description}
                                setContent={(content) =>
                                  setTask({ ...task, description: content })
                                }
                              />
                            </PopoverContent>
                          </Popover>
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
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !task.dueDate && "text-muted-foreground"
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

                    {subTasks.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <MdCheckCircleOutline />
                        <p className="text-sm">
                          {subTasks.reduce(
                            (agg, it) => (it.completed ? agg + 1 : agg),
                            0
                          )}
                          /{subTasks.length}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent onClick={(e) => e.stopPropagation()}>
                <TaskContextMenuItems task={task} setTask={setTask} />
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </TaskModal>
      )}
    </TaskProvider>
  );
};

const TaskContextMenuItems = ({
  task,
  setTask,
}: {
  task: Task;
  setTask: (task: Task) => void;
}) => {
  const { deleteAsync } = useDeleteTask(task);
  const { copy } = useCopyTaskURL(task);

  return (
    <>
      <ContextMenuItem onClick={() => deleteAsync(task.id)}>
        <MdDelete /> Delete Task
      </ContextMenuItem>
      {task.dueDate && (
        <ContextMenuItem onClick={() => setTask({ ...task, dueDate: null })}>
          <MdToday /> Remove Due Date
        </ContextMenuItem>
      )}
      {task.startDate && (
        <ContextMenuItem onClick={() => setTask({ ...task, startDate: null })}>
          <MdRemoveCircle /> Remove Start Date
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={copy}>
        <MdContentCopy /> Copy Link
      </ContextMenuItem>
    </>
  );
};
