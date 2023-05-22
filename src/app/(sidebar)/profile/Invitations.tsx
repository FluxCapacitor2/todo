"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";

export const Invitations = () => {
  const utils = trpc.useContext();
  const { data: incoming, isLoading } = trpc.invitation.listIncoming.useQuery();
  const { mutateAsync: accept } = trpc.invitation.accept.useMutation({
    onSettled: () => {
      utils.invitation.listIncoming.invalidate();
      utils.projects.list.invalidate();
    },
  });

  if (isLoading) return <Spinner />;
  return (
    <>
      <h2 className="text-2xl font-bold">Invitations</h2>
      {incoming ? (
        incoming?.map((inv) => (
          <div key={inv.id}>
            <p>
              {inv.from.name} invited you to join {inv.project.name}
            </p>
            <Button onClick={() => accept(inv.id)} variant="primary">
              Accept
            </Button>
          </div>
        ))
      ) : (
        <i>You have no incoming invitations.</i>
      )}
    </>
  );
};
