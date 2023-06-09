"use client";

import { createIDBPersister } from "@/util/idb-persister";
import { trpc } from "@/util/trpc/trpc";
import { AppRouter } from "@/util/trpc/trpc-router";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
  TRPCClientError,
  getFetch,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import superjson from "superjson";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/signed-out");
    }
  }, [router, session.status]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (
              (error as TRPCClientError<AppRouter>)?.data?.code ===
              "UNAUTHORIZED"
            ) {
              router.push("/signed-out");
            } else if (query.state.data !== undefined) {
              toast.error("There was an error updating your tasks.");
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (session.status === "unauthenticated") {
                return false;
              }
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

  const url = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc/`
    : "http://localhost:3000/api/trpc/";

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
      <PersistQueryClientProvider
        persistOptions={{ persister }}
        client={queryClient}
      >
        {children}
        {/* <ReactQueryDevtools /> */}
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
};
