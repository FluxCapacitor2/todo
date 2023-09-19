"use client";

import { NewProject } from "@/components/global/NewProjectModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdError } from "react-icons/md";

export const ProjectCards = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: 60_000 * 2, // 2 minutes
  });

  const { data: invitations } = trpc.invitation.listIncoming.useQuery(
    undefined,
    { refetchInterval: 300_000 }
  );

  const utils = trpc.useContext();

  const { mutateAsync: accept } = trpc.invitation.accept.useMutation({
    onSettled: (data, error, variables) => {
      utils.invitation.listIncoming.invalidate();
      utils.projects.list.invalidate();

      const name = utils.invitation.listIncoming
        .getData()
        ?.find((it) => it.id === variables)?.project?.name;
      if (name) {
        toast.success(`You have joined ${name}!`);
      }
    },
  });

  const { mutateAsync: rescind } = trpc.invitation.rescind.useMutation({
    onSettled: () => {
      utils.invitation.listIncoming.invalidate();
    },
  });

  const [newProjectOpen, setNewProjectOpen] = useState(false);

  useEffect(() => {
    if (projects !== undefined && projects.length === 0) {
      setNewProjectOpen(true);
    }
  }, [projects]);

  return (
    <>
      <h2 className="text-2xl font-bold">Projects</h2>
      <NewProject
        opened={newProjectOpen}
        setOpened={(state) => setNewProjectOpen(state)}
      />
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
      ) : projects.length > 0 ? (
        <div className="grid w-full grid-cols-1 justify-around gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const tasks = project.sections.reduce(
              (acc, section) => acc + section._count.tasks,
              0
            );
            return (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Card className="flex h-full flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <b>{project.sections.length}</b> section
                      {project.sections.length === 1 ? "" : "s"}
                    </p>
                    <p>
                      <b>{tasks}</b> task
                      {tasks === 1 ? "" : "s"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Projects are used to organize tasks. Get started by creating your
              first project.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setNewProjectOpen(true)} className="gap-2">
              <MdAdd />
              Create
            </Button>
          </CardFooter>
        </Card>
      )}

      {invitations && invitations.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">
            Invitations <Badge>{invitations.length}</Badge>
          </h2>
          <div className="grid w-full gap-4">
            {invitations?.map((invitation) => (
              <Card
                key={invitation.id}
                className="flex h-full flex-col justify-between"
              >
                <CardHeader>
                  <p>
                    <b>{invitation.from.name}</b> invited you to join{" "}
                    <b>{invitation.project.name}</b>
                  </p>
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button onClick={() => accept(invitation.id)}>Accept</Button>
                  <Button
                    variant="secondary"
                    onClick={() => rescind(invitation.id)}
                  >
                    Reject
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};
