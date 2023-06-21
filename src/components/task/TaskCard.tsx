import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { DatePickerPopover } from "@/components/ui/DatePickerPopover";
import { LONG_DATE_FORMAT } from "@/util/constants";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Task } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { produce } from "immer";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdCalendarToday,
  MdCheckCircleOutline,
  MdContentCopy,
  MdDelete,
  MdMoreHoriz,
  MdRemoveCircle,
  MdToday,
} from "react-icons/md";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { TaskModal } from "./TaskModal";

export const TaskWrapper = ({
  task: inTask,
  children,
}: {
  task: Task;
  children: (value: {
    task: Task;
    setTask: (task: Task) => void;
    isSaving: boolean;
  }) => ReactNode;
}) => {
  const [task, setTask] = useState(inTask);
  const initialRender = useRef(true);
  const utils = trpc.useContext();

  useEffect(() => {
    setTask(inTask); // Force the task to update when new data is received
    initialRender.current = true; // Prevent the update from causing a mutation
  }, [inTask]);

  const [lastRevision, setLastRevision] = useState(inTask);

  const { mutateAsync: updateAsync, isLoading: isSaving } =
    trpc.tasks.update.useMutation({
      onError: () => {
        toast.error("There was an error saving that task!");
        setTask(lastRevision); // Roll back the UI to the last known successful state
      },
      onSuccess: (data) => {
        setLastRevision(data);
      },
    });

  const [debouncedTask] = useDebounce(task, 500, {
    leading: true,
    trailing: true,
    maxWait: 2500,
  });

  useEffect(() => {
    if (initialRender.current === true) {
      initialRender.current = false;
      return;
    } else {
      updateAsync({
        ...debouncedTask,
        dueDate: debouncedTask.dueDate ?? undefined,
        startDate: debouncedTask.startDate ?? undefined,
      });
    }
  }, [debouncedTask, updateAsync]);

  return <>{children({ task, setTask, isSaving })}</>;
};

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
  const [modalShown, setModalShown] = useState(false);
  const [modalLoaded, setModalLoaded] = useState(false);

  useEffect(() => {
    if (modalShown) setModalLoaded(true);
  }, [modalShown]);

  const subTasks =
    "subTasks" in inTask ? (inTask.subTasks as { completed: boolean }[]) : [];

  return (
    <TaskWrapper task={inTask}>
      {({ task, setTask, isSaving }) => (
        <div
          className={clsx(
            "group relative flex cursor-pointer justify-between gap-2 @container/task",
            task.id < 0 && "pointer-events-none opacity-70",
            !isListItem &&
              "max-w-[20rem] rounded-md border border-gray-600 p-2 hover:bg-white/30",
            isSaving && "animate-pulse"
          )}
        >
          {showCheckbox && (
            <div>
              <Checkbox
                onChange={(e) => {
                  setTask({ ...task, completed: e.target.checked });
                }}
                checked={task.completed}
              />
            </div>
          )}
          <div
            className="relative flex w-full flex-col gap-2"
            onClick={() => setModalShown(true)}
          >
            {/* Task name and description */}
            <p className="flex w-full items-center justify-between font-bold">
              <span
                className={clsx(
                  "line-clamp-2",
                  task.completed && "text-gray-500 line-through"
                )}
              >
                {task.name}
              </span>
            </p>
            {details && (
              <>
                {task.dueDate && (
                  <DatePickerPopover
                    date={task.dueDate}
                    setDate={(date) => setTask({ ...task, dueDate: date })}
                  >
                    <p className="flex items-center gap-2 text-sm">
                      <MdCalendarToday />
                      {format(task.dueDate, LONG_DATE_FORMAT)}
                    </p>
                  </DatePickerPopover>
                )}
                {task.description && (
                  <p
                    className={clsx(
                      isListItem
                        ? "line-clamp-1 text-gray-500"
                        : "line-clamp-2",
                      "text-sm"
                    )}
                  >
                    {task.description}
                  </p>
                )}
              </>
            )}

            {subTasks.length > 0 && (
              <div className="flex items-center gap-2">
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
          </div>

          <div className="absolute right-1 top-1 hidden @[10rem]/task:block">
            <TaskMenuButton
              task={task}
              setTask={setTask}
              hover={true}
              button={
                <Menu.Button
                  as={Button}
                  variant="subtle"
                  className={"invisible group-hover:visible"}
                >
                  <MdMoreHoriz />
                </Menu.Button>
              }
            />
          </div>
          {modalLoaded && (
            <TaskModal
              {...{
                modalShown,
                setModalShown,
                task,
                setTask,
                isSaving,
              }}
            />
          )}
        </div>
      )}
    </TaskWrapper>
  );
};

export const TaskMenuButton = ({
  task,
  setTask,
  hover,
  button,
}: {
  task: Task;
  setTask: (task: Task) => void;
  hover: boolean;
  button: ReactNode;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync: deleteAsync } = trpc.tasks.delete.useMutation({
    onMutate: async (id) => {
      // Optimistic update
      let oldTask: Task & { subTasks?: { completed: boolean }[] } = task;
      if (task.parentTaskId) {
        oldTask = task;
        utils.tasks.get.cancel({ id: task.parentTaskId });
        utils.tasks.get.setData({ id: task.parentTaskId }, (task) => {
          if (!task) return undefined;
          return produce(task, (task) => {
            task.subTasks = task.subTasks.filter((it) => it.id !== id);
          });
        });
      } else {
        utils.tasks.listTopLevel.cancel();
        utils.projects.get.cancel(task.projectId);
        utils.projects.get.setData(task.projectId, (project) => {
          if (!project) return undefined;
          const newValue = produce(project, (project) => {
            for (const section of project.sections) {
              section.tasks = section.tasks.filter((task) => {
                if (task.id !== id) {
                  return true;
                } else {
                  oldTask = task;
                  return false;
                }
              });
            }
          });
          return newValue;
        });
      }

      return { task: oldTask };
    },
    onError: (error, id, context) => {
      toast.error("There was an error deleting that task!");
      if (task.parentTaskId) {
        utils.tasks.get.setData({ id: task.parentTaskId }, (task) => {
          if (!task) return undefined;
          if (!context?.task) return task;
          return { ...task, subTasks: [...task.subTasks, context.task] };
        });
      } else {
        utils.projects.get.setData(task.projectId, (project) => {
          if (!project) return undefined;
          return produce(project, (project) => {
            const section = project.sections.find(
              (section) => section.id === task.sectionId
            );
            if (context?.task) {
              section?.tasks?.push?.(
                context.task as Task & { subTasks: { completed: boolean }[] }
              );
            }
          });
        });
      }
    },
    onSettled: (data) => {
      if (task.parentTaskId) {
        utils.tasks.get.invalidate({ id: task.parentTaskId });
      } else {
        utils.tasks.listTopLevel.invalidate();
        utils.projects.get.invalidate(task.projectId);
      }
    },
  });

  const pathname = usePathname();
  const copy = () => {
    navigator.clipboard.writeText(
      pathname?.includes(task.projectId)
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}/${task.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/project/${task.projectId}/${task.id}`
    );
  };

  return (
    <Menu
      as="div"
      className={
        hover ? "absolute right-0.5 top-0.5 hidden @[10rem]/task:block" : ""
      }
    >
      {({ open, close }) => (
        <MenuItems open={open} close={close} button={button}>
          <MenuItem onClick={() => deleteAsync(task.id)}>
            <MdDelete /> Delete Task
          </MenuItem>
          {task.dueDate && (
            <MenuItem onClick={() => setTask({ ...task, dueDate: null })}>
              <MdToday /> Remove Due Date
            </MenuItem>
          )}
          {task.startDate && (
            <MenuItem onClick={() => setTask({ ...task, startDate: null })}>
              <MdRemoveCircle /> Remove Start Date
            </MenuItem>
          )}
          <MenuItem onClick={copy}>
            <MdContentCopy /> Copy Link
          </MenuItem>
        </MenuItems>
      )}
    </Menu>
  );
};
