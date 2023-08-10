"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import { NotificationSignUp } from "./NotificationSignUp";

const Component = () => {
  const [status, setStatus] = useState(Notification.permission);

  const request = () => {
    Notification.requestPermission().then((permission) => {
      setStatus(permission);
    });
  };

  return (
    <>
      {status === "granted" ? (
        <NotificationSignUp />
      ) : status === "denied" ? (
        <p>
          You have denied notification permissions. Please enable them to
          receive notification reminders for your tasks.
        </p>
      ) : (
        <Button onClick={request}>Request Notification Permission</Button>
      )}
    </>
  );
};

export const RequestNotificationPermission = dynamic(async () => Component, {
  ssr: false,
});
