"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import Image from "next/image";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

export default function Page() {
  const utils = trpc.useContext();

  const { data: incoming, isLoading: loadingIncoming } =
    trpc.invitation.listIncoming.useQuery();
  const { data: outgoing, isLoading: loadingOutgoing } =
    trpc.invitation.listOutgoing.useQuery();

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
      utils.invitation.listOutgoing.invalidate();
    },
  });

  if (loadingIncoming || loadingOutgoing) return <Spinner />;

  const empty =
    (!incoming || incoming.length === 0) &&
    (!outgoing || outgoing.length === 0);

  return (
    <>
      <h2 className="text-center text-3xl font-bold">Invitations</h2>

      <main
        className={clsx(
          !empty ? "flex-col" : "flex-col md:flex-row",
          "mx-auto mt-8 flex max-w-prose justify-center gap-12"
        )}
      >
        <section className="relative flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Received</h3>
          {incoming && incoming.length > 0 ? (
            incoming?.map((inv) => (
              <div key={inv.id}>
                <p>
                  <b>{inv.from.name}</b> invited <b>you</b> to join{" "}
                  <b>{inv.project.name}</b>.
                </p>
                <Button onClick={() => accept(inv.id)} variant="primary">
                  Accept
                </Button>
              </div>
            ))
          ) : (
            <div>
              <Image
                src="/images/undraw_no_data.svg"
                width={241}
                height={232}
                alt=""
                className="mx-auto opacity-30"
              />
              <i className="absolute inset-x-0 top-1/2 text-center font-medium">
                You have no incoming invitations.
              </i>
            </div>
          )}
        </section>
        <section className="relative flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Sent</h3>
          {outgoing && outgoing.length > 0 ? (
            outgoing?.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-1 rounded-md bg-gray-100 p-4 dark:bg-gray-700"
              >
                <p>
                  <b>You</b> invited <b>{inv.to.name}</b> to join{" "}
                  <b>{inv.project.name}</b>.
                </p>
                <Button variant="subtle" onClick={() => rescind(inv.id)}>
                  <MdClose /> Rescind
                </Button>
              </div>
            ))
          ) : (
            <div>
              <Image
                src="/images/undraw_messenger.svg"
                width={241}
                height={232}
                alt=""
                className="mx-auto opacity-30"
              />
              <i className="absolute inset-x-0 top-1/2 text-center font-medium">
                You have no outgoing invitations.
              </i>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
