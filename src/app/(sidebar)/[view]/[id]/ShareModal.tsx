import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { trpc } from "@/util/trpc/trpc";
import { AppRouter } from "@/util/trpc/trpc-router";
import { Role } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import toast from "react-hot-toast";
import {
  MdAccountCircle,
  MdAdd,
  MdCancel,
  MdEdit,
  MdSend,
  MdVisibility,
} from "react-icons/md";

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
  const utils = trpc.useContext();

  const { data: collaborators } = trpc.projects.collaborators.list.useQuery(
    projectId,
    { refetchInterval: 120_000 }
  );

  const { data: invitations } =
    trpc.projects.collaborators.listInvitations.useQuery(projectId, {
      refetchInterval: 60_000,
    });

  const { data: project } = trpc.projects.get.useQuery(projectId, {
    refetchInterval: false,
  });

  const { mutateAsync: remove } =
    trpc.projects.collaborators.remove.useMutation({
      onSettled: () => utils.projects.collaborators.list.invalidate(projectId),
    });

  const { mutateAsync: rescind } = trpc.invitation.rescind.useMutation({
    onSettled: () =>
      utils.projects.collaborators.listInvitations.invalidate(projectId),
  });

  const { mutateAsync: invite, isLoading: mutating } =
    trpc.projects.collaborators.invite.useMutation({
      onError: (error, variables, context) => {
        const code = (error as TRPCClientError<AppRouter>).data?.code;
        console.log(error, Array.isArray(error));
        if (code === "NOT_FOUND") {
          toast.error(
            "That user was not found! Make sure you typed their email address correctly."
          );
        } else if (code === "BAD_REQUEST") {
          const message = (error as TRPCClientError<AppRouter>).message;
          if (message === "ALREADY_INVITED") {
            toast.error("That user has already been invited to this project!");
          } else {
            toast.error("Invalid email address!");
          }
        }
      },
      onSettled: () => {
        utils.projects.collaborators.listInvitations.invalidate(projectId);
      },
    });

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

                <Button variant="ghost" onClick={() => remove(c.id)}>
                  <span className="sr-only">Remove collaborator</span>
                  <MdCancel />
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
                    <Badge className="ml-1 gap-1">
                      <MdSend />
                      Invited
                    </Badge>
                  </p>
                  <p>{inv.to.email}</p>
                </div>
                <Button variant="ghost" onClick={() => rescind(inv.id)}>
                  <span className="sr-only">Rescind invitation</span>
                  <MdCancel />
                </Button>
              </Fragment>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Invitations</h3>
            <p>
              Enter an email address and tell the recipient to check their{" "}
              <Link href="/invitations" className="font-medium underline">
                invitations page
              </Link>
              .
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!mutating) {
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
                disabled={mutating}
              />
              <Button type="submit" disabled={mutating}>
                {mutating ? <Spinner /> : <MdAdd />}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
