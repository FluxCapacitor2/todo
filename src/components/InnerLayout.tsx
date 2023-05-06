"use client";

import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export const InnerLayout = (
  props: PropsWithChildren<{ session: ExtSession | null }>
) => {
  return (
    <>
      <SessionProvider session={props.session}>
        {props.children}
      </SessionProvider>
    </>
  );
};
