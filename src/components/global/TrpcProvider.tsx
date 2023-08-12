"use client";

import { getBaseURL } from "@/lib/utils";
import { createIDBPersister } from "@/util/idb-persister";
import { trpc } from "@/util/trpc/trpc";
import { AppRouter } from "@/util/trpc/trpc-router";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
  TRPCClientError,
  getFetch,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import superjson from "superjson";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const session = useSession();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (
              (error as TRPCClientError<AppRouter>)?.data?.code !==
                "UNAUTHORIZED" &&
              query.state.data !== undefined
            ) {
              toast.error("There was an error fetching your tasks.");
            }
          },
        }),
        defaultOptions: {
          queries: {
            enabled: session.status !== "unauthenticated",
            retryDelay(failureCount, error) {
              return failureCount * 1000;
            },
            retry: (failureCount, error) => {
              const code = (error as TRPCClientError<AppRouter>)?.data?.code;
              if (code === "UNAUTHORIZED" || code === "NOT_FOUND") {
                return false;
              }
              return failureCount < 3;
            },
            cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
            staleTime: 10_000, // 10 seconds
            refetchInterval: 30_000, // 30 seconds
          },
        },
      })
  );

  const [persister] = useState(() => createIDBPersister());

  const url = getBaseURL() + "/api/trpc";

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, init);
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <SigninRedirect />
      <PersistQueryClientProvider
        persistOptions={{ persister }}
        client={queryClient}
      >
        {children}
        <ReactQueryDevtools />
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
};

const SigninRedirect = () => {
  useSession({
    required: true,
    onUnauthenticated: () => {
      window.location.href = `/signin?next=${encodeURIComponent(
        window.location.pathname
      )}`;
    },
  });

  return null;
};
