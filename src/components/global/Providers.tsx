"use client";

import { queryClient } from "@/util/urql/urql";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Provider } from "urql";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <Provider value={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};
