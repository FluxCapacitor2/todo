"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button variant="danger" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
