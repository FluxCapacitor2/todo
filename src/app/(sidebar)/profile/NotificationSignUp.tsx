"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { graphql } from "@/gql";
import { app } from "@/util/firebase";
import { getMessaging, getToken } from "firebase/messaging";
import dynamic from "next/dynamic";
import { use } from "react";
import { useMutation, useQuery } from "urql";

const getNotificationToken = () => {
  return getToken(getMessaging(app), {
    vapidKey:
      "BAbp2MP4kLRLjeEepW6Vdw7LTAUDXomqZalGuZgVJqb4trjdTgrgTkp1y6p6Buk1vpQeVmR_C60LO32hYKTYHT8",
  });
};

export const GetNotificationTokensQuery = graphql(`
  query getNotificationTokens {
    me {
      id
      notificationTokens {
        id
        token
      }
    }
  }
`);

const AddNotificationTokenMutation = graphql(`
  mutation addNotificationToken($token: String!, $userAgent: String!) {
    addNotificationToken(token: $token, userAgent: $userAgent) {
      id
      token
      userAgent
    }
  }
`);

const RemoveNotificationTokenMutation = graphql(`
  mutation removeNotificationToken($token: String!) {
    removeNotificationToken(token: $token) {
      id
    }
  }
`);

const ClientComponent = () => {
  const [{ data, fetching }] = useQuery({
    query: GetNotificationTokensQuery,
  });
  const tokens = data?.me?.notificationTokens;

  const [{ fetching: isAdding }, addAsync] = useMutation(
    AddNotificationTokenMutation
  );
  const [{ fetching: isRemoving }, removeAsync] = useMutation(
    RemoveNotificationTokenMutation
  );

  const token = use(getNotificationToken());

  const request = async () => {
    const permission = await Notification.requestPermission();
    if (permission == "granted") {
      await addAsync({
        token: token!,
        userAgent: navigator.userAgent ?? "Unknown",
      });
    }
  };

  const revoke = async () => {
    console.log("Removing", token);
    await removeAsync({ token });
  };

  const signedUp = tokens?.some((t) => t.token === token);

  return (
    <>
      {fetching ? (
        <Button variant="secondary" disabled={true}>
          <Spinner />
          Loading...
        </Button>
      ) : signedUp ? (
        <Button
          variant="secondary"
          onClick={revoke}
          disabled={isAdding || isRemoving}
        >
          {isRemoving ? "Disabling..." : "Disable Notifications"}
        </Button>
      ) : (
        <Button onClick={request} disabled={isAdding || isRemoving}>
          {isRemoving ? "Enabling..." : "Enable Notifications"}
        </Button>
      )}
    </>
  );
};

const Loading = () => (
  <Button variant="secondary" disabled>
    <Spinner />
    Loading...
  </Button>
);

export const NotificationSignUp = dynamic(
  () => Promise.resolve(ClientComponent),
  {
    loading: () => <Loading />,
  }
);
