"use client";

import { UpdateProjectMutation } from "@/app/queries";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";
import { Project } from "@/gql/graphql";
import { RequireOf } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { MdDelete, MdUnarchive } from "react-icons/md";
import { useMutation, useQuery } from "urql";
import { DeleteModal } from "../../(perProject)/project/[id]/DeleteModal";

const GetArchivedProjectsQuery = graphql(`
  query getArchivedProjects {
    me {
      id
      projects(archived: true) {
        id
        name
        archived
      }
    }
  }
`);

export default function Page() {
  const [{ data, fetching }] = useQuery({ query: GetArchivedProjectsQuery });
  const projects = data?.me?.projects;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-2">
      <h1 className="text-3xl font-bold">Archived Projects</h1>
      {fetching ? (
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
  project: RequireOf<Project, "id" | "name">;
}) => {
  const [updateProjectStatus, updateProject] = useMutation(
    UpdateProjectMutation
  );

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
          onClick={() => updateProject({ id: project.id, archived: false })}
          disabled={updateProjectStatus.fetching}
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
