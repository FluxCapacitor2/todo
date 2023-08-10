"use client";

import { Button } from "@/components/ui/button";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";

export const SignInButton = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  return (
    <Button
      key={provider.id}
      className="gap-2"
      variant="white"
      onClick={() =>
        signIn(provider.id, {
          callbackUrl:
            new URLSearchParams(window.location.search).get("next") ??
            "/projects",
        })
      }
    >
      <Image
        src={`https://authjs.dev/img/providers/${provider.id}.svg`}
        width={16}
        height={16}
        alt=""
        className=""
      />
      Sign in with {provider.name}
    </Button>
  );
};
