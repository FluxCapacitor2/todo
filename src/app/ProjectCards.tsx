"use client";

import { NewProjectModal } from "@/components/global/NewProjectModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";

export const ProjectCards = () => {
  const { data: projects, isLoading, isError } = trpc.projects.list.useQuery();

  const [modalShown, setModalShown] = useState(false);

  useEffect(() => {
    if (projects?.length === 0) {
      setModalShown(true);
    }
  }, [projects]);

  return (
    <>
      <NewProjectModal open={modalShown} close={() => setModalShown(false)} />
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
            <div
              className="bg-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-950 cursor-pointer p-4 rounded-md"
              onClick={() => setModalShown(true)}
            >
              <h2 className="text-lg font-bold">New Project</h2>
              <div className="items-center my-2 flex gap-2">
                <MdAdd /> Create
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center my-12">
          <h2 className="text-2xl font-bold">No Projects</h2>
          <Button variant="primary" onClick={() => setModalShown(true)}>
            New Project
          </Button>
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
        className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md h-full"
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
