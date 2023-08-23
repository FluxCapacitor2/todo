"use client";

import { NewProject } from "@/components/global/NewProjectModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { MdError } from "react-icons/md";

export const ProjectCards = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = trpc.projects.list.useQuery(undefined, { refetchInterval: 120_000 });

  return (
    <>
      <h2 className="text-2xl font-bold">Projects</h2>
      <div>
        <NewProject />
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          {/* Fallback/skeleton UI */}
          <div className="grid w-full grid-cols-1 justify-around gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {new Array(4).fill(undefined).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-8 w-40" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : isError ? (
        <p className="flex items-center gap-2 font-bold text-red-500">
          <MdError />
          Error loading projects.
        </p>
      ) : (
        projects.length > 0 && (
          <>
            <div className="grid w-full grid-cols-1 justify-around gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  projectId={project.id}
                  name={project.name}
                  sections={project.sections.length}
                  tasks={project.sections.reduce(
                    (acc, section) => acc + section._count.tasks,
                    0
                  )}
                />
              ))}
            </div>
          </>
        )
      )}
    </>
  );
};

const ProjectCard = ({
  projectId,
  name,
  sections,
  tasks,
}: {
  projectId: string;
  name: string;
  sections: number;
  tasks: number;
}) => {
  return (
    <Link href={`/project/${projectId}`}>
      <Card key={projectId} className="flex h-full flex-col justify-between">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <b>{sections}</b> section
            {sections === 1 ? "" : "s"}
          </p>
          <p>
            <b>{tasks}</b> task
            {tasks === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
