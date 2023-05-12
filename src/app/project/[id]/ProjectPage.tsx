"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import { Project, Section, Task } from "@prisma/client";
import { useRef, useState } from "react";
import { MdDelete, MdEdit, MdMenu } from "react-icons/md";
import { AddSectionTask } from "../../../components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Menu } from "@headlessui/react";
import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";

export const ProjectPage = ({
  project,
}: {
  project: Project & { sections: Section[] };
}) => {
  const { data } = trpc.projects.get.useQuery(project.id, {
    initialData: project,
  });

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex overflow-x-scroll">
        {data.sections.map((section) => (
          <Section key={section.id} section={section} projectId={data.id} />
        ))}
        <div>
          <NewSection projectId={data.id} />
        </div>
      </div>
    </>
  );
};

const Section = ({
  section,
  projectId,
}: {
  section: Section & { tasks: Task[] };
  projectId: string;
}) => {
  const utils = trpc.useContext();

  const { mutateAsync } = trpc.sections.delete.useMutation();

  const deleteSection = async (id: number) => {
    await mutateAsync({ id });
    utils.projects.get.invalidate(projectId);
  };

  return (
    <div
      className="mr-4 flex h-[calc(100vh-4rem)] flex-col rounded-lg p-2"
      key={section.id}
    >
      <div className="flex items-center justify-between">
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
            <MenuItem onClick={() => deleteSection(section.id)}>
              <MdDelete /> Delete Section
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <div className="flex flex-col gap-2">
        {section.tasks.map((task) => (
          <TaskCard task={task} key={task.id} projectId={projectId} />
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
        <input
          type="text"
          ref={textField}
          className="h-6 w-60 rounded-md bg-transparent p-1 font-bold"
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
  const { mutateAsync } = trpc.sections.create.useMutation();

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
