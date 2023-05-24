"use client";

import { TextField } from "@/components/ui/TextField";
import { trpc } from "@/util/trpc/trpc";

export const CalendarFeed = () => {
  const { data: apiToken, isLoading } = trpc.user.getApiToken.useQuery(
    undefined,
    { refetchInterval: false, staleTime: Infinity }
  );

  return (
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
  );
};
