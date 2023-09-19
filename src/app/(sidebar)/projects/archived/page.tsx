"use client";

import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { useUpdateProject } from "@/hooks/project";
import { trpc } from "@/util/trpc/trpc";
import { Project } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { MdDelete, MdUnarchive } from "react-icons/md";
import { DeleteModal } from "../../(perProject)/project/[id]/DeleteModal";

export default function Page() {
  const { data: projects, isLoading } = trpc.projects.listArchived.useQuery();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-3xl font-bold">Archived Projects</h1>
      {isLoading ? (
        <Spinner />
      ) : projects?.length ?? 0 > 0 ? (
        <div className="flex flex-col gap-4">
          {projects?.map((project) => (
            <ArchivedProjectCard project={project} key={project.id} />
          ))}
        </div>
      ) : (
        <>
          <p>You don&apos;t have any archived projects!</p>
        </>
      )}
    </main>
  );
}

const ArchivedProjectCard = ({
  project,
}: {
  project: Pick<Project, "id" | "name">;
}) => {
  const { updateProject, isMutating } = useUpdateProject(project.id);

  const [opened, setOpened] = useState(false);

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <DeleteModal
        projectId={project.id}
        projectName={project.name}
        opened={opened}
        setOpened={setOpened}
      />
      <h2 className="text-lg font-bold">{project.name}</h2>
      <div className="flex items-center gap-2">
        <Link className="inline-block" href={`/project/${project.id}`}>
          <Button variant="secondary">View</Button>
        </Link>
        <Button
          onClick={() => updateProject({ archived: false })}
          disabled={isMutating}
        >
          <MdUnarchive />
          Unarchive
        </Button>
        <Button onClick={() => setOpened(true)} variant="destructive">
          <MdDelete />
          Delete
        </Button>
      </div>
    </div>
  );
};
