import { Button } from "@/components/ui/Button";
import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Task } from "@prisma/client";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdMoreHoriz, MdDelete, MdCalendarToday } from "react-icons/md";
import { TaskModal } from "./TaskModal";
import clsx from "clsx";
import { ReactNode } from "react";
import { debounce } from "throttle-debounce";
import { useDebounce } from "use-debounce";

export const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

interface TaskContextType {
  task: Task;
  setTask: (task: Task) => void;
  isSaving: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskWrapper = ({
  task: inTask,
  projectId,
  children,
}: {
  task: Task;
  projectId: string;
  children: (value: TaskContextType) => ReactNode;
}) => {
  const [task, setTask] = useState(inTask);
  const initialRender = useRef(true);

  useEffect(() => {
    setTask(inTask); //Force the task to update when new data is received
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
        updateAsync({
          ...debouncedTask,
          dueDate: debouncedTask.dueDate ?? undefined,
        });
        if (debouncedTask.parentTaskId) {
          invalidateParent({ id: debouncedTask.parentTaskId });
        }
      }
    })();
  }, [debouncedTask, updateAsync, invalidateParent]);

  return (
    <TaskContext.Provider value={{ task, setTask, isSaving }}>
      <TaskContext.Consumer>
        {(value) => (value ? children(value) : null)}
      </TaskContext.Consumer>
    </TaskContext.Provider>
  );
};

export const TaskCard = ({
  task: inTask,
  projectId,
  isListItem,
  details,
}: {
  task: Task;
  projectId: string;
  isListItem?: boolean;
  details?: boolean;
}) => {
  const [modalShown, setModalShown] = useState(false);

  return (
    <TaskWrapper task={inTask} projectId={projectId}>
      {({ task, setTask, isSaving }) => (
        <>
          <div
            className={clsx(
              "group relative flex cursor-pointer justify-between gap-2 p-2",
              !isListItem &&
                "max-w-[17.5rem] rounded-md border border-gray-600 hover:bg-white/30"
            )}
          >
            <div>
              <TaskCheckbox />
            </div>
            <div
              className="relative flex w-full flex-col gap-2"
              onClick={() => setModalShown(true)}
            >
              {/* Task name and description */}
              <p className="flex w-full items-center justify-between font-bold">
                <span
                  className={clsx(
                    task.completed && "line-clamp-1 text-gray-500 line-through"
                  )}
                >
                  {task.name}
                </span>
                {isSaving && <Spinner />}
              </p>
              {details && (
                <>
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
                  {task.dueDate && (
                    <p className="flex items-center gap-2">
                      <MdCalendarToday />
                      {format.format(task.dueDate)}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="absolute right-1 top-1">
              <TaskMenuButton task={task} projectId={projectId} />
            </div>
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
        </>
      )}
    </TaskWrapper>
  );
};

export const TaskMenuButton = ({
  task,
  projectId,
}: {
  task: Task;
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
      </MenuItems>
    </Menu>
  );
};

const TaskCheckbox = () => {
  return (
    <TaskContext.Consumer>
      {(value) =>
        value && (
          <input
            type="checkbox"
            onChange={(e) => {
              value.setTask({ ...value.task, completed: e.target.checked });
            }}
            checked={value.task.completed}
          />
        )
      }
    </TaskContext.Consumer>
  );
};
