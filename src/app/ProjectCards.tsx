"use client";

import { NewProjectModal } from "@/components/global/NewProjectModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdAdd, MdError } from "react-icons/md";

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
      <h2 className="text-2xl font-bold">Projects</h2>
      {isLoading ? (
        <div className="flex justify-center">
          {/* Fallback/skeleton UI */}
          <div className="grid w-full grid-cols-1 justify-around gap-4 sm:grid-cols-2 md:grid-cols-3">
            {new Array(4).fill(undefined).map((_, i) => (
              <div
                key={i}
                className="flex h-28 flex-col gap-2 rounded-md bg-gray-100 p-4 dark:bg-gray-900"
              >
                <div className="h-8 w-48 animate-pulse bg-gray-200 delay-100 dark:bg-gray-800" />
                <div className="h-6 w-32 animate-pulse bg-gray-200 delay-200 dark:bg-gray-800" />
              </div>
            ))}
            <NewProject show={() => setModalShown(true)} />
          </div>
        </div>
      ) : isError ? (
        <p className="flex items-center gap-2 font-bold text-red-500">
          <MdError />
          Error loading projects.
        </p>
      ) : projects.length > 0 ? (
        <>
          <div className="grid w-full grid-cols-1 justify-around gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                name={project.name}
              />
            ))}
            <NewProject show={() => setModalShown(true)} />
          </div>
        </>
      ) : (
        <div className="my-12 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">No Projects</h2>
          <Button variant="primary" onClick={() => setModalShown(true)}>
            New Project
          </Button>
        </div>
      )}
    </>
  );
};

const NewProject = ({ show }: { show: () => void }) => {
  return (
    <div
      className="cursor-pointer rounded-md bg-gray-50 p-4 hover:bg-gray-200 dark:bg-gray-950 dark:hover:bg-gray-800"
      onClick={show}
    >
      <h2 className="text-lg font-bold">New Project</h2>
      <div className="my-2 flex items-center gap-2">
        <MdAdd /> Create
      </div>
    </div>
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
        className="h-full rounded-md bg-gray-100 p-4 dark:bg-gray-900"
        key={projectId}
      >
        <h2 className="text-lg font-medium">{data?.name ?? name}</h2>
        {isLoading ? (
          <>
            <Spinner />
          </>
        ) : isError ? (
          <span className="text-red-500">
            <MdError className="inline" /> Error loading tasks.
          </span>
        ) : (
          <>
            <p>
              <b>{data?.sections.length}</b> section
              {data?.sections?.length === 1 ? "" : "s"}
            </p>
            <p>
              <b>{total}</b> task
              {total === 1 ? "" : "s"}
            </p>
          </>
        )}
      </div>
    </Link>
  );
};
