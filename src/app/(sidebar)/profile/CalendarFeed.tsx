"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/TextField";
import { trpc } from "@/util/trpc/trpc";
import { MdRefresh } from "react-icons/md";

export const CalendarFeed = () => {
  const utils = trpc.useContext();
  const { data: apiToken, isLoading } = trpc.user.getApiToken.useQuery(
    undefined,
    { refetchInterval: false, staleTime: Infinity }
  );

  const { mutateAsync: rotate, isLoading: rotating } =
    trpc.user.invalidateApiToken.useMutation({
      onSettled: () => utils.user.getApiToken.refetch(),
    });

  return (
    <div className="flex gap-2">
      <TextField
        readOnly
        value={
          isLoading
            ? "Loading..."
            : process.env.NEXT_PUBLIC_BASE_URL + "/api/calendar/" + apiToken?.id
        }
        className="w-96"
        onClick={(e) => e.currentTarget.select()}
      />
      <Button
        variant="secondary"
        title="Get a new link"
        onClick={() => rotate(apiToken!.id)}
        disabled={isLoading || rotating}
      >
        {isLoading || rotating ? <Spinner /> : <MdRefresh />}
      </Button>
    </div>
  );
};
