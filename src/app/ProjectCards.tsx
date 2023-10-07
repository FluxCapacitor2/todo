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
import { graphql } from "@/gql";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGlobe, FaLock, FaLockOpen } from "react-icons/fa";
import { MdAdd, MdError } from "react-icons/md";
import { useMutation, useQuery } from "urql";

const ProjectsListQuery = graphql(`
  query projectAndInvitationList {
    me {
      id
      projects {
        id
        name
        createdAt
        owner {
          id
          name
          image
        }
        collaborators {
          id
          user {
            id
            name
            image
          }
        }
      }
      incomingInvitations {
        id
        from {
          id
          name
        }
        project {
          id
          name
        }
      }
    }
  }
`);

const AcceptInvitationMutation = graphql(`
  mutation acceptInvitation($id: String!) {
    acceptInvitation(id: $id) {
      id
    }
  }
`);

export const RejectInvitationMutation = graphql(`
  mutation rejectInvitation($id: String!) {
    rejectInvitation(id: $id) {
      id
    }
  }
`);

export const ProjectCards = () => {
  const [{ data, error, fetching }] = useQuery({ query: ProjectsListQuery });
  const invitations = data?.me?.incomingInvitations;
  const projects = data?.me?.projects;

  const session = useSession();

  const [_acceptResult, accept] = useMutation(AcceptInvitationMutation);
  const [_rejectResult, reject] = useMutation(RejectInvitationMutation);

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
      {fetching ? (
        <div className="grid">
          {/* Fallback/skeleton UI */}
          {new Array(4).fill(undefined).map((_, i) => (
            <div className="mb-2 flex justify-between border-b py-8" key={i}>
              <div>
                <Skeleton className="mb-1 h-6 w-48" />
                <Skeleton className="mb-1 h-4 w-12" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <div className="flex flex-row-reverse items-center">
                {new Array(2 + (i % 2)).fill(undefined).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="-mx-1 h-12 w-12 rounded-full border-2 border-background"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error !== undefined ? (
        <p className="flex items-center gap-2 font-bold text-red-500">
          <MdError />
          Error loading projects.
        </p>
      ) : projects && projects.length > 0 ? (
        <div className="grid">
          {projects?.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id}>
              <div className="mb-2 flex justify-between border-b py-8">
                <div>
                  <h2 className="text-lg font-medium">{project.name}</h2>
                  {project.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      Created {formatRelative(project.createdAt, new Date())}
                    </p>
                  )}
                  {project.collaborators && (
                    <p className="text-sm text-muted-foreground">
                      {project.collaborators.length > 0 ? (
                        project.owner.id === session.data?.id ? (
                          <>
                            <FaGlobe className="mr-1 inline" />
                            Shared with {project.collaborators.length}{" "}
                            collaborators
                          </>
                        ) : (
                          <>
                            <FaLockOpen className="mr-1 inline" />
                            Shared with you by{" "}
                            <span className="font-medium">
                              {project.owner.name}
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <FaLock className="mr-1 inline" />
                          Private
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-row-reverse items-center">
                  {!!project.owner?.image && (
                    <div className="-mx-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-background">
                      <Image
                        unoptimized
                        src={project.owner.image}
                        alt={project.owner.name ?? ""}
                        width={48}
                        height={48}
                        className="aspect-square"
                      />
                    </div>
                  )}
                  {!!project.collaborators &&
                    project.collaborators.map((collaborator) => (
                      <div
                        className="-mx-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-background"
                        key={collaborator.id}
                      >
                        <Image
                          unoptimized
                          src={collaborator.user?.image ?? ""}
                          alt={collaborator.user?.name ?? ""}
                          width={48}
                          height={48}
                          className="aspect-square"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </Link>
          ))}
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
                  <Button onClick={() => accept({ id: invitation.id })}>
                    Accept
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => reject({ id: invitation.id })}
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
