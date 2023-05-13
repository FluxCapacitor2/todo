import { DatePickerPopover } from "@/app/project/[id]/DatePickerPopover";
import { Button } from "@/components/ui/Button";
import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Task } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  MdCalendarToday,
  MdDelete,
  MdMoreHoriz,
  MdRemoveCircle,
  MdToday,
} from "react-icons/md";
import { useDebounce } from "use-debounce";
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

  const utils = trpc.useContext();
  const { mutateAsync: updateAsync, isLoading: isSaving } =
    trpc.tasks.update.useMutation();

  const [debouncedTask] = useDebounce(task, 500, {
    leading: true,
    trailing: true,
    maxWait: 2500,
  });

  // eslint-disable-next-line
  const invalidateParent = useMemo(() => utils.tasks.get.invalidate, []);

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
        if (debouncedTask.parentTaskId) {
          invalidateParent({ id: debouncedTask.parentTaskId });
        }
      }
    })();
  }, [debouncedTask, updateAsync, invalidateParent]);

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
            "group relative flex cursor-pointer justify-between gap-2 p-2",
            !isListItem &&
              "max-w-[20rem] rounded-md border border-gray-600 hover:bg-white/30"
          )}
        >
          {showCheckbox && (
            <div>
              <input
                type="checkbox"
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
                      {format(task.dueDate, "MMM do, hhaaa")}
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

          <div className="absolute right-1 top-1">
            <TaskMenuButton
              task={task}
              setTask={setTask}
              projectId={projectId}
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
}: {
  task: Task;
  setTask: (task: Task) => void;
  projectId: string;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync: deleteAsync } = trpc.tasks.delete.useMutation();
  const deleteTask = async () => {
    await deleteAsync(task.id);
    if (task.parentTaskId) {
      utils.tasks.get.invalidate({ id: task.parentTaskId });
    } else {
      utils.projects.get.invalidate(projectId);
    }
  };

  return (
    <Menu as={"div"}>
      <Menu.Button
        as={Button}
        variant="subtle"
        onClickCapture={() => {}}
        className="invisible group-hover:visible"
      >
        <MdMoreHoriz />
      </Menu.Button>

      <MenuItems>
        <MenuItem onClick={deleteTask}>
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
      </MenuItems>
    </Menu>
  );
};
