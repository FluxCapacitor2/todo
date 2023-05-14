"use client";

import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/Button";
import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { Menu } from "@headlessui/react";
import { Section, Task } from "@prisma/client";
import clsx from "clsx";
import { produce } from "immer";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDelete, MdEdit, MdMenu } from "react-icons/md";
import { AddSectionTask } from "../../../components/task/AddTask";

export default function Page({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const { data } = trpc.projects.get.useQuery(projectId);

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex snap-x overflow-x-scroll">
        {data.sections.map((section) => (
          <Section key={section.id} section={section} projectId={data.id} />
        ))}
        <div>
          <NewSection projectId={data.id} />
        </div>
      </div>
    </>
  );
}

const Section = ({
  section,
  projectId,
}: {
  section: Section & { tasks: Task[] };
  projectId: string;
}) => {
  const utils = trpc.useContext();

  const { mutateAsync: deleteSection } = trpc.sections.delete.useMutation({
    onMutate: ({ id }) => {
      const project = utils.projects.get.getData(projectId);
      const index = project?.sections.findIndex((section) => section.id === id);
      if (index === -1 || index === undefined) return;
      const prevSection = project?.sections?.[index];

      utils.projects.get.cancel(projectId);
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;

        const g = {
          ...project,
          sections: project.sections.filter((section) => section.id !== id),
        };
        return g;
      });

      return { prevSection, index };
    },
    onError: (error, { id }, context) => {
      if (!context) return;
      toast.error("There was an error deleting that section!");
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return produce(project, (project) => {
          project.sections.splice(context.index!, 0, context.prevSection!);
        });
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });

  return (
    <div
      className="mr-4 flex h-[calc(100vh-6rem)] snap-center flex-col rounded-lg p-2"
      key={section.id}
    >
      <div
        className={clsx(
          "flex items-center justify-between",
          section.id < 0 && "pointer-events-none opacity-70"
        )}
      >
        <SectionName
          id={section.id}
          initialName={section.name}
          projectId={projectId}
        />
        <Menu as="div" className="relative">
          <Menu.Button as={Button} variant="flat">
            <MdMenu />
          </Menu.Button>
          <MenuItems>
            <MenuItem onClick={() => deleteSection({ id: section.id })}>
              <MdDelete /> Delete Section
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <div className="flex flex-col gap-2">
        {sortByDueDate(section.tasks).map((task) => (
          <TaskCard task={task} key={task.id} projectId={projectId} details />
        ))}
        <AddSectionTask projectId={projectId} sectionId={section.id} />
      </div>
    </div>
  );
};

const SectionName = ({
  id,
  initialName,
  projectId,
}: {
  id: number;
  initialName: string;
  projectId: string;
}) => {
  const utils = trpc.useContext();
  const textField = useRef<HTMLInputElement | null>(null);
  const { mutateAsync, isLoading } = trpc.sections.update.useMutation();

  const [name, setName] = useState(initialName);

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          textField.current?.blur();
        }}
      >
        <TextField
          flat
          ref={textField}
          className="px-1 font-bold"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={async (e) => {
            if (name !== initialName) {
              await mutateAsync({ id, name });
              utils.projects.get.invalidate(projectId);
            }
          }}
        />
      </form>
      {isLoading && (
        <div className="absolute inset-y-0 right-0">
          <Spinner />
        </div>
      )}
    </div>
  );
};

const NewSection = ({ projectId }: { projectId: string }) => {
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.sections.create.useMutation({
    onMutate: ({ name, projectId }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.projects.get.cancel(projectId);
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return {
          ...project,
          sections: [
            ...project.sections,
            { name: "New Section", id: newId, projectId, tasks: [] },
          ],
        };
      });
      return { newId };
    },
    onError: (error, variables, context) => {
      toast.error("There was an error creating that section!");
      if (!context) return;
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return {
          ...project,
          sections: {
            ...project.sections.filter((it) => it.id !== context.newId),
          },
        };
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });

  const newSection = async () => {
    await mutateAsync({
      projectId,
      name: "New Section",
    });
    utils.projects.get.invalidate(projectId);
  };

  return (
    <Button variant="subtle" onClick={newSection}>
      <MdEdit />
      New Section
    </Button>
  );
};
