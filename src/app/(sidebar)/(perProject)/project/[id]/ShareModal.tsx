import { RejectInvitationMutation } from "@/app/ProjectCards";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { graphql } from "@/gql";
import { Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import {
  MdAccountCircle,
  MdAdd,
  MdCancel,
  MdEdit,
  MdSend,
  MdVisibility,
} from "react-icons/md";
import { useMutation, useQuery } from "urql";

const roles = {
  [Role.EDITOR]: (
    <>
      <MdEdit /> Editor
    </>
  ),
  [Role.VIEWER]: (
    <>
      <MdVisibility /> Viewer
    </>
  ),
};

const ShareModalQuery = graphql(`
  query shareModal($id: String!) {
    me {
      id
      project(id: $id) {
        id
        owner {
          id
          name
          email
          image
        }
        invitations {
          id
          to {
            id
            name
            email
            image
          }
        }
        collaborators {
          id
          role
          user {
            id
            name
            email
            image
          }
        }
      }
    }
  }
`);

const RemoveCollaboratorMutation = graphql(`
  mutation removeCollaborator($id: String!, $projectId: String!) {
    removeCollaborator(id: $id, projectId: $projectId) {
      id
      collaborators {
        id
      }
    }
  }
`);

const InviteCollaboratorMutation = graphql(`
  mutation inviteCollaborator($projectId: String!, $email: String!) {
    inviteCollaborator(projectId: $projectId, email: $email) {
      id
      id
    }
  }
`);

export const ShareModal = ({
  projectId,
  opened,
  close,
}: {
  projectId: string;
  opened: boolean;
  close: () => void;
}) => {
  const emailField = useRef<HTMLInputElement | null>(null);

  const [{ data, fetching }] = useQuery({
    query: ShareModalQuery,
    variables: { id: projectId },
    pause: !opened,
  });
  const project = data?.me?.project;
  const collaborators = project?.collaborators;
  const invitations = project?.invitations;

  const [{ fetching: removing }, remove] = useMutation(
    RemoveCollaboratorMutation
  );
  const [{ fetching: inviting }, invite] = useMutation(
    InviteCollaboratorMutation
  );
  const [{ fetching: rejecting }, reject] = useMutation(
    RejectInvitationMutation
  );

  const add = () => {
    if (emailField.current) {
      const email = emailField.current.value;
      emailField.current.value = "";
      // Send invitation
      invite({ email, projectId });
    }
  };

  return (
    <Sheet open={opened} onOpenChange={(open) => !open && close()} modal>
      <SheetContent>
        <div className="flex flex-col gap-4">
          <SheetTitle>Add People</SheetTitle>
          <p>Invite others to your project for collaborative editing.</p>
          <h3 className="mt-4 font-bold">Collaborators</h3>
          <div className="grid grid-cols-[max-content,1fr,min-content] gap-2">
            {project?.owner?.image ? (
              <Image
                src={project?.owner?.image}
                alt=""
                width={52}
                height={52}
                unoptimized
                className="rounded-full"
              />
            ) : (
              <div className="h-[52px] w-[52px] animate-pulse rounded-full bg-gray-500" />
            )}
            <div>
              <p className="text-lg font-bold">
                {project?.owner?.name ?? <Spinner />}
                <Badge className="ml-1 gap-1">
                  <MdAccountCircle /> Owner
                </Badge>
              </p>
              <p>{project?.owner?.email}</p>
            </div>
            {/* Extra column to line up with the "remove" button for other collaborators */}
            <div />
            {collaborators?.map((c) => (
              <Fragment key={c.id}>
                {c.user.image && (
                  <Image
                    src={c.user.image}
                    alt=""
                    width={52}
                    height={52}
                    unoptimized
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-lg font-bold">
                    {c.user.name}
                    <Badge className="ml-1 gap-1">{roles[c.role]}</Badge>
                  </p>
                  <p>{c.user.email}</p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => remove({ id: c.id, projectId })}
                  disabled={removing}
                >
                  {removing ? (
                    <>
                      <span className="sr-only">Removing...</span>
                      <Spinner />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Remove collaborator</span>
                      <MdCancel />
                    </>
                  )}
                </Button>
              </Fragment>
            ))}
            {invitations?.map((inv) => (
              <Fragment key={inv.id}>
                {inv.to.image && (
                  <Image
                    src={inv.to.image}
                    alt=""
                    width={52}
                    height={52}
                    unoptimized
                    className="rounded-full"
                  />
                )}
                <div className="grow">
                  <p className="text-lg font-bold">
                    {inv.to.name}
                    <Badge className="ml-1 gap-1" variant="secondary">
                      <MdSend />
                      Invited
                    </Badge>
                  </p>
                  <p>{inv.to.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => reject({ id: inv.id })}
                  disabled={rejecting}
                >
                  {rejecting ? (
                    <>
                      <Spinner />
                      <span className="sr-only">Loading...</span>
                    </>
                  ) : (
                    <>
                      <MdCancel />
                      <span className="sr-only">Rescind invitation</span>
                    </>
                  )}
                </Button>
              </Fragment>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Invitations</h3>
            <p>
              Enter an email address and tell the recipient to check their{" "}
              <Link href="/projects" className="font-medium underline">
                invitations page
              </Link>
              .
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!inviting) {
                add();
              }
            }}
          >
            <Label htmlFor="shareEmail">Email address</Label>
            <div className="flex gap-2">
              <Input
                id="shareEmail"
                ref={emailField}
                type="email"
                required
                className="flex-1"
                disabled={inviting}
              />
              <Button type="submit" disabled={inviting}>
                {inviting ? <Spinner /> : <MdAdd />}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
