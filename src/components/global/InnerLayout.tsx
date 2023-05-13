"use client";

import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { MdOfflineBolt } from "react-icons/md";

export const useOnline = () => {
  const [online, setOnline] = useState(
    typeof window === "undefined" || navigator.onLine
  );

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  });

  return online;
};

export const InnerLayout = (
  props: PropsWithChildren<{ session: ExtSession | null }>
) => {
  const online = useOnline();

  useEffect(() => {
    if (online) {
      document.body.classList.remove("offline");
      document.body.classList.add("online");
    } else {
      document.body.classList.remove("online");
      document.body.classList.add("offline");
    }
  }, [online]);

  return (
    <>
      {!online && (
        <div className="flex h-10 w-full flex-wrap items-center justify-center gap-2 bg-red-500 text-white">
          <MdOfflineBolt />
          <span className="font-bold">You are offline!</span>
          <span className="hidden md:inline">
            Please reconnect to continue to use the app.
          </span>
        </div>
      )}
      <SessionProvider session={props.session}>
        {props.children}
      </SessionProvider>
    </>
  );
};
