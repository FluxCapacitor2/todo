"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { app } from "@/util/firebase";
import { trpc } from "@/util/trpc/trpc";
import { getMessaging, getToken } from "firebase/messaging";
import dynamic from "next/dynamic";
import { use } from "react";

const getNotificationToken = () => {
  return getToken(getMessaging(app), {
    vapidKey:
      "BAbp2MP4kLRLjeEepW6Vdw7LTAUDXomqZalGuZgVJqb4trjdTgrgTkp1y6p6Buk1vpQeVmR_C60LO32hYKTYHT8",
  });
};

const component = () => {
  const { data: tokens, isLoading } = trpc.user.getTokens.useQuery();
  const { mutateAsync: addAsync, isLoading: isAdding } =
    trpc.user.addToken.useMutation();
  const { mutateAsync: removeAsync, isLoading: isRemoving } =
    trpc.user.removeToken.useMutation();

  const utils = trpc.useContext();

  const token = use(getNotificationToken());

  const request = async () => {
    const permission = await Notification.requestPermission();
    if (permission == "granted") {
      console.log(token);
      await addAsync(token!);
      utils.user.getTokens.invalidate();
    }
  };

  const revoke = async () => {
    console.log("Removing", token);
    await removeAsync(token!);
    utils.user.getTokens.invalidate();
  };

  const signedUp = tokens?.some((t) => t.token === token);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : signedUp ? (
        <Button variant="subtle" onClick={revoke}>
          Disable Notifications
          {isRemoving && <Spinner />}
        </Button>
      ) : (
        <Button variant="primary" onClick={request}>
          Enable Notifications
          {isAdding && <Spinner />}
        </Button>
      )}
    </>
  );
};

const Loading = () => (
  <Button variant="subtle" disabled>
    <Spinner />
    Loading...
  </Button>
);

export const NotificationSignUp = dynamic(() => Promise.resolve(component), {
  loading: () => <Loading />,
});
