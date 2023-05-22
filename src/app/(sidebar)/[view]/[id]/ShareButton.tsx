"use client";
import { Button } from "@/components/ui/Button";
import { CustomDialog, DialogTitle } from "@/components/ui/CustomDialog";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { trpc } from "@/util/trpc/trpc";
import { AppRouter } from "@/util/trpc/trpc-router";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAdd, MdShare } from "react-icons/md";

export const ShareButton = ({ projectId }: { projectId: string }) => {
  const [modalShown, setModalShown] = useState(false);

  const emailField = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();

  const { data: collaborators } = trpc.projects.collaborators.list.useQuery(
    projectId,
    { enabled: modalShown }
  );

  const { data: invitations } =
    trpc.projects.collaborators.listInvitations.useQuery(projectId, {
      enabled: modalShown,
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
    <>
      <Button variant="subtle" onClick={() => setModalShown(true)}>
        <MdShare />
        Share
      </Button>
      <CustomDialog opened={modalShown} close={() => setModalShown(false)}>
        <div className="flex flex-col gap-4">
          <DialogTitle>Add People</DialogTitle>
          <p>Invite others to your project for collaborative editing.</p>
          <h3 className="text-2xl font-bold">Collaborators</h3>
          {collaborators && collaborators.length > 0 ? (
            <div className="grid grid-cols-2">
              {collaborators?.map((c) => (
                <Fragment key={c.id}>
                  <p>{c.user.name}</p>
                  <p>{c.role}</p>
                </Fragment>
              ))}
            </div>
          ) : (
            <i>No collaborators yet.</i>
          )}
          <h3 className="text-2xl font-bold">Invitations</h3>
          {invitations && invitations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {invitations?.map((inv) => (
                <div key={inv.id} className="flex gap-4">
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
                  <div>
                    <p className="text-lg font-bold">{inv.to.name}</p>
                    <p>{inv.to.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <i>
              No invitations. Use the form below to invite people to your
              project.
            </i>
          )}
          <div className="grid grid-cols-2"></div>
          <div className="flex gap-2">
            <TextField
              ref={emailField}
              type="email"
              className="flex-1"
              placeholder="Type an email address..."
            />
            <Button variant="primary" onClick={add} disabled={mutating}>
              {mutating ? <Spinner /> : <MdAdd />}
            </Button>
          </div>
          <div className="flex justify-end"></div>
        </div>
      </CustomDialog>
    </>
  );
};
