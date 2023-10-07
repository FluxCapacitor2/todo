"use client";

import { DeleteSectionModal } from "@/components/project/DeleteSectionModal";
import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, Task } from "@/gql/graphql";
import { RequireOf, cn } from "@/lib/utils";
import { sortByDueDate } from "@/util/sort";
import clsx from "clsx";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdArchive,
  MdCalendarToday,
  MdDelete,
  MdEdit,
  MdMoreHoriz,
} from "react-icons/md";
import { useMutation, useQuery } from "urql";
import {
  CreateSectionMutation,
  GetProjectQuery,
  UpdateSectionMutation,
} from "../../../../queries";

export default function ProjectView({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const [{ data, fetching }] = useQuery({
    query: GetProjectQuery,
    variables: { id: projectId },
  });
  const project = data?.me?.project;

  if (fetching) {
    // Loading UI (skeleton)
    return <ProjectSkeleton />;
  }

  return (
    <div className="h-full max-h-full snap-x snap-mandatory overflow-scroll lg:snap-none">
      <div className="ml-2 flex w-max">
        {project?.sections?.map((section) => (
          <Section
            key={section.id}
            section={{
              ...section,
              tasks: section.tasks.map((it) => ({
                ...it,
                dueDate: it.dueDate ?? null,
                startDate: it.startDate ?? null,
              })),
            }}
            projectId={project.id}
            readonly={project.archived}
          />
        ))}
        {project !== undefined && !project.archived && (
          <NewSection projectId={project.id} />
        )}
      </div>
    </div>
  );
}

const ProjectSkeleton = () => (
  <div className="ml-2 flex">
    {new Array(5).fill(null).map((_, i) => (
      <div className="mr-4 flex w-80 snap-center flex-col rounded-lg" key={i}>
        <div className="relative mb-2 flex h-10 w-full items-center justify-between rounded-md border border-border pl-2">
          <Skeleton className="h-6 w-52" />
          <div className="absolute inset-y-0 right-2">
            <Button variant="ghost" size="icon" disabled>
              <MdMoreHoriz />
            </Button>
          </div>
        </div>
        <div className="flex w-80 flex-col gap-2">
          {new Array([5, 3, 4, 3, 2][i]).fill(null).map((_, j) => (
            <Card key={j}>
              <CardContent className="p-4 py-2">
                <div className="flex gap-2">
                  <div className="grid h-8 items-center">
                    <Checkbox disabled checked={j < 2} />
                  </div>
                  <Skeleton className="mt-1 h-6 w-48" />
                </div>
                {(i + j + 1) % 3 !== 0 && (
                  <Card className="mt-2">
                    <CardContent className="flex flex-col gap-2 p-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                )}
                {(i + j) % 2 !== 0 && (
                  <Card className="mt-2">
                    <CardContent className="flex gap-2 p-2">
                      <MdCalendarToday className="text-muted-foreground" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Section = ({
  section,
  projectId,
  readonly,
}: {
  section: Omit<RequireOf<Section, "id">, "tasks"> & {
    tasks: RequireOf<
      Task,
      | "id"
      | "dueDate"
      | "createdAt"
      | "completed"
      | "description"
      | "name"
      | "projectId"
      | "startDate"
    >[];
  };
  projectId: string;
  readonly: boolean;
}) => {
  const [updateSectionStatus, updateSection] = useMutation(
    UpdateSectionMutation
  );

  const archive = () =>
    updateSection({ id: parseInt(section.id), archived: true })
      .catch((err) => {
        toast.error("There was a problem archiving that section!");
      })
      .then(() => {
        toast.success("Section archived!");
      });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div
      className={cn("mr-4 flex w-80 snap-center flex-col rounded-lg")}
      key={section.id}
    >
      <SectionName
        className="sticky top-0"
        id={parseInt(section.id)}
        initialName={section.name ?? ""}
        archived={section.archived}
        disabled={readonly}
      >
        {!readonly && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MdMoreHoriz />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={archive}>
                  <MdArchive /> Archive
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                  <MdDelete /> Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteSectionModal
              opened={deleteModalOpen}
              setOpened={setDeleteModalOpen}
              projectId={projectId}
              sectionId={parseInt(section.id)}
              sectionName={section.name ?? ""}
            />
          </>
        )}
      </SectionName>
      <div
        className={clsx(
          "mt-2 flex w-80 flex-col gap-2",
          section.archived && "opacity-50"
        )}
      >
        {sortByDueDate(section.tasks).map((task) => (
          <TaskCard task={task} key={task.id} details readonly={readonly} />
        ))}
        {!readonly && (
          <AddSectionTask
            projectId={projectId}
            sectionId={parseInt(section.id)}
          />
        )}
      </div>
    </div>
  );
};

const SectionName = ({
  className,
  id,
  initialName,
  archived,
  children,
  disabled,
}: {
  className?: string;
  id: number;
  initialName: string;
  archived?: boolean;
  children: ReactNode;
  disabled: boolean;
}) => {
  const textField = useRef<HTMLInputElement | null>(null);

  const [_updateSectionStatus, updateSection] = useMutation(
    UpdateSectionMutation
  );

  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  return (
    <div className={cn("group relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          textField.current?.blur();
        }}
        className="flex items-center gap-1"
      >
        <Input
          type="text"
          ref={textField}
          disabled={disabled}
          className={cn(
            "w-full px-2 font-semibold",
            archived && "text-muted-foreground line-through"
          )}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={async (e) => {
            if (name !== initialName) {
              if (name.trim().length === 0) {
                toast.error("The section name must not be empty!");
                setName(initialName);
                return;
              }
              await updateSection({ id, name });
            }
          }}
        />
        <div className="absolute inset-y-0 right-2">{children}</div>
      </form>
    </div>
  );
};

const NewSection = ({ projectId }: { projectId: string }) => {
  const [createSectionStatus, createSection] = useMutation(
    CreateSectionMutation
  );

  const newSection = async () => {
    await createSection({
      projectId,
    });
  };

  return (
    <div className="mr-4 flex w-80 shrink-0 snap-center flex-col rounded-lg">
      <Button
        variant="secondary"
        onClick={newSection}
        className="sticky top-0"
        disabled={createSectionStatus.fetching}
      >
        <MdEdit />
        New Section
      </Button>
    </div>
  );
};
