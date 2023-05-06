import { Button } from "@/components/Button";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { useState, useRef } from "react";
import { MdCancel, MdSend } from "react-icons/md";

export const AddSectionTask = ({
  sectionId,
  projectId,
}: {
  sectionId: number;
  projectId: string;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.tasks.create.useMutation();
  return (
    <AddTask
      onAdd={async ({ name, description }) => {
        await mutateAsync({ name, description, sectionId });
        utils.projects.get.invalidate(projectId);
      }}
    />
  );
};

export const AddSubtask = ({ parentTaskId }: { parentTaskId: number }) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.tasks.addSubtask.useMutation();
  return (
    <AddTask
      onAdd={async ({ name, description }) => {
        await mutateAsync({
          id: parentTaskId,
          name,
          description,
        });
        utils.tasks.get.invalidate({ id: parentTaskId });
      }}
    />
  );
};

const AddTask = ({
  onAdd,
}: {
  onAdd: ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => Promise<void>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [focused, setFocused] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);
  const nameField = useRef<HTMLInputElement | null>(null);

  const reset = () => {
    form.current!.reset();
    setName("");
    setDescription("");
  };

  const newTask = async () => {
    await onAdd({
      name,
      description,
    });
    reset();
    nameField.current?.focus();
  };

  return (
    <form
      ref={form}
      className={clsx(
        "w-min p-2 my-2 flex flex-col gap-2",
        focused &&
          "bg-white dark:bg-black border-gray-600 border rounded-lg min-w-full"
      )}
      onSubmit={async (e) => {
        e.preventDefault();
        await newTask();
      }}
      onMouseDown={() => setFocused(true)}
      onKeyDown={() => setFocused(true)}
      onBlur={(e) => {
        if (form.current?.contains(e.relatedTarget)) {
          return;
        }
        if (name.trim() === "" && description.trim() === "") {
          setFocused(false);
        }
      }}
    >
      <input
        type="text"
        placeholder={focused ? "Name" : "Add a new task..."}
        className="bg-transparent rounded-md p-1"
        onChange={(e) => setName(e.target.value)}
        ref={nameField}
      />
      {focused && (
        <>
          <textarea
            placeholder="Description"
            className="bg-transparent rounded-md p-1 h-16"
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={async (e) => {
              if (e.ctrlKey && e.key == "Enter") {
                await newTask();
              }
            }}
          />
          <div className="self-end flex gap-2">
            <Button
              variant="subtle"
              onClick={() => {
                setFocused(false);
                reset();
              }}
              type="button"
            >
              <MdCancel />
            </Button>
            <Button variant="primary" type="submit">
              <MdSend />
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
