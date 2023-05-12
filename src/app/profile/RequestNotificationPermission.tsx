"use client";

import { Button } from "@/components/ui/Button";
import { NotificationSignUp } from "./NotificationSignUp";
import { useState } from "react";

export const RequestNotificationPermission = () => {
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
        <>
          <Button variant="primary" onClick={request}>
            Request Notification Permission
          </Button>
        </>
      )}
    </>
  );
};
