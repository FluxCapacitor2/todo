"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import Image from "next/image";
import toast from "react-hot-toast";
import { MdCheck, MdClose } from "react-icons/md";

export default function Page() {
  const utils = trpc.useContext();

  const { data: incoming, isLoading: loadingIncoming } =
    trpc.invitation.listIncoming.useQuery(undefined, {
      refetchInterval: 30_000,
    });
  const { data: outgoing, isLoading: loadingOutgoing } =
    trpc.invitation.listOutgoing.useQuery(undefined, {
      refetchInterval: 120_000,
    });

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

  const empty =
    (!incoming || incoming.length === 0) &&
    (!outgoing || outgoing.length === 0);

  return (
    <div className="px-2">
      <h2 className="text-center text-3xl font-bold">Invitations</h2>

      <main className="mx-auto mt-8 flex max-w-prose flex-col justify-center gap-12">
        <section className="relative flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Received</h3>
          {incoming && incoming.length > 0 ? (
            incoming?.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <p>
                    <b>{inv.from.name}</b> invited <b>you</b> to join{" "}
                    <b>{inv.project.name}</b>.
                  </p>
                  <Button className="gap-2" onClick={() => accept(inv.id)}>
                    <MdCheck />
                    Accept
                  </Button>
                </CardContent>
              </Card>
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
                {loadingIncoming ? (
                  <Spinner />
                ) : (
                  "You have no incoming invitations."
                )}
              </i>
            </div>
          )}
        </section>
        <section className="relative flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Sent</h3>
          {outgoing && outgoing.length > 0 ? (
            outgoing?.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <p>
                    <b>You</b> invited <b>{inv.to.name}</b> to join{" "}
                    <b>{inv.project.name}</b>.
                  </p>
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={() => rescind(inv.id)}
                  >
                    <MdClose /> Rescind
                  </Button>
                </CardContent>
              </Card>
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
                {loadingOutgoing ? (
                  <Spinner />
                ) : (
                  "You have no outgoing invitations."
                )}
              </i>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
