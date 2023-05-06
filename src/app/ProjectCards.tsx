"use client";

import { Spinner } from "@/components/Spinner";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { useMemo } from "react";

export const ProjectCards = () => {
  const { data: projects, isLoading, isError } = trpc.projects.list.useQuery();

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <p>Error loading projects.</p>
      ) : projects.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-around w-full">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                name={project.name}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center my-12">
          <h2 className="text-2xl font-bold">No Projects</h2>
          <p>
            Use the &quot;New Project&quot; menu in the sidebar to create a new
            project.
          </p>
        </div>
      )}
    </>
  );
};

const ProjectCard = ({
  projectId,
  name,
}: {
  projectId: string;
  name: string;
}) => {
  const { data, isLoading, isError } = trpc.projects.get.useQuery(projectId);

  const total = useMemo(
    () => data?.sections.reduce((acc, s) => acc + s.tasks.length, 0),
    [data]
  );

  return (
    <Link href={`/project/${projectId}`}>
      <div
        className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md"
        key={projectId}
      >
        <h2 className="text-lg font-medium">{data?.name ?? name}</h2>
        {isLoading ? (
          <>
            <Spinner />
          </>
        ) : isError ? (
          <>Error loading project information</>
        ) : (
          <>
            <p>
              {total} task{total === 1 ? "" : "s"}
            </p>
          </>
        )}
      </div>
    </Link>
  );
};
