import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { DatePickerPopover } from "@/components/ui/DatePickerPopover";
import { Spinner } from "@/components/ui/Spinner";
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

  useEffect(() => {
    setTask(inTask); // Force the task to update when new data is received
    initialRender.current = true; // Prevent the update from causing a mutation
  }, [inTask]);

  const { mutateAsync: updateAsync, isLoading: isSaving } =
    trpc.tasks.update.useMutation();

  const [debouncedTask] = useDebounce(task, 500, {
    leading: true,
    trailing: true,
    maxWait: 2500,
  });

  useEffect(() => {
    (async () => {
      if (initialRender.current === true) {
        initialRender.current = false;
        return;
      } else {
        await updateAsync({
          ...debouncedTask,
          dueDate: debouncedTask.dueDate ?? undefined,
          startDate: debouncedTask.startDate ?? undefined,
        });
      }
    })();
  }, [debouncedTask, updateAsync]);

  return <>{children({ task, setTask, isSaving })}</>;
};

export const TaskCard = ({
  task: inTask,
  projectId,
  isListItem,
  details,
  showCheckbox = true,
}: {
  task: Task;
  projectId: string;
  isListItem?: boolean;
  details?: boolean;
  showCheckbox?: boolean;
}) => {
  const [modalShown, setModalShown] = useState(false);

  return (
    <TaskWrapper task={inTask}>
      {({ task, setTask, isSaving }) => (
        <div
          className={clsx(
            "group relative flex cursor-pointer justify-between gap-2 @container/task",
            task.id < 0 && "pointer-events-none opacity-70",
            !isListItem &&
              "max-w-[20rem] rounded-md border border-gray-600 p-2 hover:bg-white/30"
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
                  "line-clamp-1",
                  task.completed && "text-gray-500 line-through"
                )}
              >
                {task.name}
              </span>
              {isSaving && <Spinner />}
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
          </div>

          <div className="absolute right-1 top-1 hidden @[10rem]/task:block">
            <TaskMenuButton
              task={task}
              setTask={setTask}
              projectId={projectId}
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
          <TaskModal
            {...{
              modalShown,
              setModalShown,
              task,
              projectId,
              setTask,
              isSaving,
            }}
          />
        </div>
      )}
    </TaskWrapper>
  );
};

export const TaskMenuButton = ({
  task,
  setTask,
  projectId,
  hover,
  button,
}: {
  task: Task;
  setTask: (task: Task) => void;
  projectId: string;
  hover: boolean;
  button: ReactNode;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync: deleteAsync } = trpc.tasks.delete.useMutation({
    onMutate: async (id) => {
      // Optimistic update
      if (task.parentTaskId) {
        utils.tasks.get.cancel({ id: task.parentTaskId });
        utils.tasks.get.setData({ id: task.parentTaskId }, (task) => {
          if (!task) return undefined;
          return produce(task, (task) => {
            task.subTasks = task.subTasks.filter((it) => it.id !== id);
          });
        });
      } else {
        utils.tasks.listTopLevel.cancel();
        utils.projects.get.cancel(projectId);
        utils.projects.get.setData(projectId, (project) => {
          if (!project) return undefined;
          const newValue = produce(project, (project) => {
            for (const section of project.sections) {
              section.tasks = section.tasks.filter((task) => task.id !== id);
            }
          });
          return newValue;
        });
      }

      return { task };
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
        utils.projects.get.setData(projectId, (project) => {
          if (!project) return undefined;
          return produce(project, (project) => {
            const section = project.sections.find(
              (section) => section.id === task.sectionId
            );
            if (context?.task) {
              section?.tasks?.push?.(context.task);
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
        utils.projects.get.invalidate(projectId);
      }
    },
  });

  const pathname = usePathname();
  const copy = () => {
    navigator.clipboard.writeText(
      pathname?.includes(projectId)
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/${pathname}/${task.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/project/${projectId}/${task.id}`
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
