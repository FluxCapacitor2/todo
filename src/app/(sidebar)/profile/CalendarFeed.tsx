"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { getBaseURL } from "@/lib/utils";
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
      <Input
        type="text"
        readOnly
        value={
          isLoading
            ? "Loading..."
            : getBaseURL() + "/api/calendar/" + apiToken?.id
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
