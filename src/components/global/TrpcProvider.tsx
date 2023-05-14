"use client";

import { createIDBPersister } from "@/util/idb-persister";
import { trpc } from "@/util/trpc/trpc";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 10000, // 10 seconds
            refetchInterval: 1000 * 120, // 2 minutes
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
        <ReactQueryDevtools />
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
};
