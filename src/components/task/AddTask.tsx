import { Button } from "@/components/ui/Button";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { MdCancel, MdSend } from "react-icons/md";
import { SelectField } from "../ui/SelectField";
import { TextArea, TextField } from "../ui/TextField";

export const AddSectionTask = ({
  sectionId,
  projectId,
}: {
  sectionId?: number;
  projectId: string;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.tasks.create.useMutation();
  return (
    <AddTask
      projectId={projectId}
      section={sectionId}
      onAdd={async ({ name, description, sectionId }) => {
        await mutateAsync({ name, description, sectionId });
        utils.projects.get.invalidate(projectId);
      }}
    />
  );
};

export const AddSubtask = ({
  projectId,
  parentTaskId,
}: {
  projectId: string;
  parentTaskId: number;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.tasks.addSubtask.useMutation();
  return (
    <AddTask
      sectionEditable={false}
      projectId={projectId}
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
  projectId,
  section: defaultSection,
  sectionEditable = true,
}: {
  onAdd: ({
    name,
    description,
    sectionId,
  }: {
    name: string;
    description: string;
    sectionId: number;
  }) => Promise<void>;
  projectId: string;
  section?: number;
  sectionEditable?: boolean;
}) => {
  const { data, isLoading, isError } = trpc.projects.get.useQuery(projectId);

  const [focused, setFocused] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);
  const nameField = useRef<HTMLInputElement | null>(null);
  const descField = useRef<HTMLTextAreaElement | null>(null);
  const sectionField = useRef<HTMLSelectElement | null>(null);

  const reset = () => {
    form.current!.reset();
  };

  const newTask = async () => {
    if (sectionEditable && !sectionField.current?.value) {
      toast.error("Please select a section to add the task to!");
      return;
    }
    if (!nameField.current?.value) {
      toast.error("Title must not be empty!");
      return;
    }
    await onAdd({
      name: nameField.current!.value,
      description: descField.current!.value,
      sectionId: parseInt(sectionField.current!.value),
    });
    reset();
    nameField.current?.focus();
  };

  return (
    <form
      ref={form}
      className={clsx(
        "flex min-w-min flex-col gap-2",
        focused &&
          "min-w-full rounded-lg border border-gray-600 bg-white p-2 dark:bg-black"
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
        if (
          !nameField.current?.value.trim() &&
          !descField.current?.value.trim()
        ) {
          setFocused(false);
        }
      }}
    >
      <TextField
        placeholder={focused ? "Name" : "Add a new task..."}
        className="rounded-md bg-transparent p-1"
        ref={nameField}
      />
      {focused && (
        <>
          {sectionEditable && (
            <SelectField ref={sectionField} defaultValue={defaultSection}>
              {data?.sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </SelectField>
          )}
          <TextArea
            ref={descField}
            placeholder="Description"
            className="h-16 rounded-md bg-transparent p-1"
            onKeyDown={async (e) => {
              if (e.ctrlKey && e.key == "Enter") {
                await newTask();
              }
            }}
          />
          <div className="flex gap-2 self-end">
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
