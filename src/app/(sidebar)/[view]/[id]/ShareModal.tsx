import { Button } from "@/components/ui/Button";
import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { trpc } from "@/util/trpc/trpc";
import { AppRouter } from "@/util/trpc/trpc-router";
import { Role } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import { Fragment, useRef } from "react";
import toast from "react-hot-toast";
import {
  MdAccountCircle,
  MdAdd,
  MdCancel,
  MdEdit,
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

  const { data: collaborators } =
    trpc.projects.collaborators.list.useQuery(projectId);

  const { data: invitations } =
    trpc.projects.collaborators.listInvitations.useQuery(projectId);

  const { data: project } = trpc.projects.get.useQuery(projectId);

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
    <CustomDialog opened={opened} close={close}>
      <div className="flex flex-col gap-4">
        <DialogTitle>Add People</DialogTitle>
        <p>Invite others to your project for collaborative editing.</p>
        <h3 className="text-2xl font-bold">Collaborators</h3>
        <div className="grid grid-cols-[max-content,1fr,1fr,min-content] gap-2">
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
            </p>
            <p>{project?.owner?.email}</p>
          </div>
          <p className="flex items-center gap-2 justify-self-end">
            <MdAccountCircle /> Owner
          </p>
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
                <p className="text-lg font-bold">{c.user.name}</p>
                <p>{c.user.email}</p>
              </div>
              <p className="flex items-center gap-2 justify-self-end">
                {roles[c.role]}
              </p>
              <Button
                variant="flat"
                onClick={() => remove(c.id)}
                title="Remove collaborator"
              >
                <MdCancel />
              </Button>
            </Fragment>
          ))}
        </div>
        <h3 className="text-2xl font-bold">Invitations</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!mutating) {
              add();
            }
          }}
        >
          <div className="flex gap-2">
            <TextField
              ref={emailField}
              type="email"
              className="flex-1"
              placeholder="Type an email address..."
              disabled={mutating}
            />
            <Button variant="primary" type="submit" disabled={mutating}>
              {mutating ? <Spinner /> : <MdAdd />}
            </Button>
          </div>
        </form>
        {invitations && invitations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {invitations?.map((inv) => (
              <div key={inv.id} className="flex gap-2">
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
                  <p className="text-lg font-bold">{inv.to.name}</p>
                  <p>{inv.to.email}</p>
                </div>
                <Button
                  variant="flat"
                  onClick={() => rescind(inv.id)}
                  title="Rescind invitation"
                >
                  <MdCancel />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <i>
            No invitations. Use the form above to invite people to your project.
          </i>
        )}

        <hr className="mt-2 border-b border-t-0 border-gray-500" />
        <div className="flex justify-end">
          <Button variant="flat" onClick={() => close()}>
            Close
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};
