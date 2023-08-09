"use client";

import { AddSectionTask } from "@/components/task/AddTask";
import { TaskCard } from "@/components/task/TaskCard";
import { Spinner } from "@/components/ui/Spinner";
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
import { useCreateSection } from "@/hooks/section";
import { cn } from "@/lib/utils";
import { sortByDueDate } from "@/util/sort";
import { trpc } from "@/util/trpc/trpc";
import { Section, Task } from "@prisma/client";
import clsx from "clsx";
import { produce } from "immer";
import { ReactNode, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdArchive,
  MdCalendarToday,
  MdDelete,
  MdEdit,
  MdMenu,
} from "react-icons/md";

export const ProjectView = ({ id: projectId }: { id: string }) => {
  const { data } = trpc.projects.get.useQuery(projectId, {
    useErrorBoundary: true,
    refetchInterval: 30_000,
  });

  if (!data) {
    // Loading UI (skeleton)
    return ProjectSkeleton;
  }

  return (
    <>
      <div className="flex snap-x snap-mandatory overflow-x-scroll lg:snap-none">
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

export const ProjectSkeleton = (
  <div className="flex">
    {new Array(3).fill(null).map((_, i) => (
      <div
        className="mr-4 flex w-80 snap-center flex-col rounded-lg p-2"
        key={i}
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-52 animate-pulse rounded-md bg-gray-500/50" />
          <Button variant="ghost">
            <MdMenu />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {new Array([5, 3, 4][i]).fill(null).map((_, j) => (
            <Card key={j}>
              <CardContent className="p-2">
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

  const { mutateAsync: updateSection } = trpc.sections.update.useMutation({
    onMutate: ({ id, archived }) => {
      utils.projects.get.cancel(projectId);
      const originalData = utils.projects.get
        .getData(projectId)
        ?.sections?.find((section) => section.id === id)?.archived;
      utils.projects.get.setData(projectId, (project) => {
        return produce(project, (project) => {
          project?.sections.forEach((section) => {
            if (section.id === id) {
              section.archived = archived === true;
            }
          });
        });
      });
      return { originalData };
    },
    onError: (error, { id }, context) => {
      if (!context) return;
      utils.projects.get.setData(projectId, (project) => {
        return produce(project, (project) => {
          project?.sections.forEach((section) => {
            if (section.id === id) {
              section.archived = context.originalData === true;
            }
          });
        });
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });

  const archive = () =>
    updateSection({ id: section.id, archived: true })
      .catch((err) => {
        toast.error("There was a problem archiving that section!");
      })
      .then(() => {
        toast.success("Section archived!");
      });

  return (
    <div
      className={cn(
        "mr-4 flex w-80 snap-center flex-col rounded-lg",
        section.id < 0 && "pointer-events-none"
      )}
      key={section.id}
    >
      <SectionName
        id={section.id}
        initialName={section.name}
        projectId={projectId}
        archived={section.archived}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {section.id < 0 ? (
              <Spinner />
            ) : (
              <Button variant="ghost" size="icon">
                <MdMenu />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={archive}>
              <MdArchive /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteSection({ id: section.id })}>
              <MdDelete /> Delete Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SectionName>
      <div
        className={clsx(
          "mt-2 flex min-h-screen w-80 flex-col gap-2",
          section.archived && "opacity-50"
        )}
      >
        {sortByDueDate(section.tasks).map((task) => (
          <TaskCard task={task} key={task.id} details />
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
  archived,
  children,
}: {
  id: number;
  initialName: string;
  projectId: string;
  archived?: boolean;
  children: ReactNode;
}) => {
  const utils = trpc.useContext();
  const textField = useRef<HTMLInputElement | null>(null);
  const { mutateAsync, isLoading } = trpc.sections.update.useMutation();

  const [name, setName] = useState(initialName);

  return (
    <div className="group relative w-full">
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
              await mutateAsync({ id, name });
              utils.projects.get.invalidate(projectId);
            }
          }}
        />
        <div className="absolute inset-y-0 right-2">{children}</div>
      </form>
    </div>
  );
};

const NewSection = ({ projectId }: { projectId: string }) => {
  const { createSection } = useCreateSection(projectId);

  const newSection = async () => {
    await createSection({
      projectId,
      name: "New Section",
    });
  };

  return (
    <div className="mr-4 flex w-80 snap-center flex-col rounded-lg">
      <Button variant="secondary" onClick={newSection}>
        <MdEdit />
        New Section
      </Button>
    </div>
  );
};
