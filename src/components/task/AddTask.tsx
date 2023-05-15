import { Button } from "@/components/ui/Button";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { produce } from "immer";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdCalendarToday, MdCancel, MdSend } from "react-icons/md";
import { SelectField } from "../ui/SelectField";
import { TextArea, TextField } from "../ui/TextField";
import { DatePickerPopover } from "@/app/(sidebar)/project/[id]/DatePickerPopover";
import { format } from "date-fns";

const defaultTask = {
  completed: false,
  createdAt: new Date(),
  dueDate: null,
  ownerId: "",
  parentTaskId: null,
  priority: 0,
  startDate: null,
  updatedAt: new Date(),
};

export const AddSectionTask = ({
  sectionId,
  projectId,
}: {
  sectionId?: number;
  projectId: string;
}) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.tasks.create.useMutation({
    onMutate: ({ sectionId, name, description, dueDate }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.projects.get.cancel(projectId);

      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return produce(project, (project) => {
          for (const section of project.sections) {
            if (section.id === sectionId) {
              section.tasks.push({
                ...defaultTask,
                id: newId,
                sectionId,
                name,
                description: description ?? "",
                dueDate,
              });
            }
          }
        });
      });

      return { newId };
    },
    onError: (error, { sectionId, name, description }, context) => {
      toast.error("There was an error adding a new task!");
      if (!context) return;

      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return produce(project, (project) => {
          for (const section of project.sections) {
            section.tasks = section.tasks.filter(
              (it) => it.id !== context.newId
            );
          }
        });
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });
  return (
    <AddTask
      projectId={projectId}
      section={sectionId}
      onAdd={({ name, description, sectionId, dueDate }) =>
        mutateAsync({ name, description, sectionId: sectionId!, dueDate })
      }
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
  const { mutateAsync } = trpc.tasks.addSubtask.useMutation({
    onMutate: ({ name, id, description, dueDate }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.tasks.get.cancel({ id: parentTaskId });
      utils.tasks.get.setData({ id: parentTaskId }, (task) => {
        if (!task) return undefined;
        return {
          ...task,
          subTasks: [
            ...task.subTasks,
            {
              ...defaultTask,
              id: newId,
              parentTaskId: id,
              sectionId: null,
              name,
              description: description ?? "",
              dueDate,
            },
          ],
        };
      });

      return { newId };
    },
    onError: (error, { name, id, description }, context) => {
      toast.error("There was an error adding that sub-task!");
      if (!context) return;
      utils.tasks.get.setData({ id }, (task) => {
        if (!task) return undefined;
        return {
          ...task,
          subTasks: task.subTasks.filter((it) => it.id !== context.newId),
        };
      });
    },
    onSettled: () => {
      utils.tasks.get.invalidate({ id: parentTaskId });
    },
  });
  return (
    <AddTask
      sectionEditable={false}
      projectId={projectId}
      onAdd={({ name, description, dueDate }) =>
        mutateAsync({
          id: parentTaskId,
          name,
          description,
          dueDate,
        })
      }
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
    dueDate,
  }: {
    name: string;
    description: string;
    sectionId: number | null;
    dueDate: Date | null;
  }) => Promise<void>;
  projectId: string;
  section?: number;
  sectionEditable?: boolean;
}) => {
  const { data, isLoading, isError } = trpc.projects.get.useQuery(projectId);

  const [focused, setFocused] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const form = useRef<HTMLFormElement | null>(null);
  const nameField = useRef<HTMLInputElement | null>(null);
  const descField = useRef<HTMLTextAreaElement | null>(null);
  const sectionField = useRef<HTMLSelectElement | null>(null);

  const reset = () => {
    form.current!.reset();
    setDueDate(null);
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
    onAdd({
      name: nameField.current!.value,
      description: descField.current!.value,
      sectionId: sectionEditable ? parseInt(sectionField.current!.value) : null,
      dueDate,
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
            <DatePickerPopover date={dueDate ?? undefined} setDate={setDueDate}>
              <Button variant="subtle">
                <MdCalendarToday />
                {!dueDate ? "Add Due Date" : format(dueDate, "MMM do, hhaaa")}
              </Button>
            </DatePickerPopover>
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
