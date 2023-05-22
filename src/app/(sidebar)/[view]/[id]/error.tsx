"use client";

import { Button } from "@/components/ui/Button";
import { AppRouter } from "@/util/trpc/trpc-router";
import { TRPCClientError } from "@trpc/client";
import { MdError } from "react-icons/md";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const code = (error as TRPCClientError<AppRouter>)?.data?.code;
  return (
    <section className="mx-auto mt-8 flex w-max flex-col items-center gap-4 text-red-500">
      <MdError className="h-16 w-16" />
      <div className="max-w-md">
        <p className="text-center font-bold">
          There was an error fetching that project!{" "}
          <span className="text-xs text-gray-500">({code})</span>
        </p>
        <p className="text-black dark:text-white">
          Please try again later and make sure you have access to the project.
        </p>
      </div>
      <Button onClick={reset} variant="danger">
        Retry
      </Button>
    </section>
  );
}
