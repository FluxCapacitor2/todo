"use client";

import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { app } from "@/util/firebase";
import { trpc } from "@/util/trpc/trpc";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";

export const InnerLayout = (
  props: PropsWithChildren<{ session: ExtSession | null }>
) => {
  const { mutateAsync } = trpc.user.addToken.useMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      Notification.requestPermission().then((permission) => {
        if (permission == "granted") {
          const messaging = getMessaging(app);
          getToken(messaging, {
            vapidKey:
              "BAbp2MP4kLRLjeEepW6Vdw7LTAUDXomqZalGuZgVJqb4trjdTgrgTkp1y6p6Buk1vpQeVmR_C60LO32hYKTYHT8",
          }).then((token) => {
            console.log(token);
            mutateAsync(token);
          });
          onMessage(messaging, (payload) => {
            alert(payload.notification?.body);
            console.log("Notification received!", payload);
          });
        }
      });
    }
  }, []);

  return (
    <>
      <SessionProvider session={props.session}>
        {props.children}
      </SessionProvider>
    </>
  );
};
