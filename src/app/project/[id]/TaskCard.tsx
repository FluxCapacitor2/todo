import { Button } from "@/components/Button";
import { MenuItem, MenuItems } from "@/components/CustomMenu";
import { Spinner } from "@/components/Spinner";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Task } from "@prisma/client";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { MdMoreHoriz, MdDelete } from "react-icons/md";
import { TaskModal } from "./TaskModal";
import clsx from "clsx";
import { ReactNode } from "react";

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

  // eslint-disable-next-line
  const invalidateParent = useMemo(() => utils.tasks.get.invalidate, []);

  useEffect(() => {
    (async () => {
      if (initialRender.current === true) {
        initialRender.current = false;
        return;
      } else {
        await updateAsync({
          ...task,
          dueDate: task.dueDate ?? undefined,
        });
        if (task.parentTaskId) {
          invalidateParent({ id: task.parentTaskId });
        }
      }
    })();
  }, [task, updateAsync, invalidateParent]);

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
}: {
  task: Task;
  projectId: string;
  isListItem?: boolean;
}) => {
  const [modalShown, setModalShown] = useState(false);

  return (
    <TaskWrapper task={inTask} projectId={projectId}>
      {({ task, setTask, isSaving }) => (
        <>
          <div
            className={clsx(
              "p-2 group flex justify-between gap-2 cursor-pointer",
              isListItem
                ? "border-b border-gray-600 rounded-sm"
                : "border border-gray-600 hover:bg-white/30 rounded-md max-w-[17.5rem]"
            )}
          >
            <div>
              <TaskCheckbox />
            </div>
            <div
              className="relative flex flex-col gap-2 w-full"
              onClick={() => setModalShown(true)}
            >
              {/* Task name and description */}
              <p className="font-bold flex justify-between w-full items-center">
                <span
                  className={clsx(
                    task.completed && "text-gray-500 line-through"
                  )}
                >
                  {task.name}
                </span>
                {isSaving && <Spinner />}
              </p>
              {!isListItem && <p className="text-sm">{task.description}</p>}
            </div>

            <TaskMenuButton task={task} projectId={projectId} />
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
