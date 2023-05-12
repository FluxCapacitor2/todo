"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";

export const SignInButton = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  return (
    <button
      key={provider.id}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-black transition-colors hover:bg-gray-200 dark:hover:bg-gray-300"
      onClick={async () => {
        window.location.href = "https://youtube.com";
        console.log("Signing in with ", provider.id);
        await signIn(provider.id);
      }}
    >
      <Image
        src={`https://authjs.dev/img/providers/${provider.id}.svg`}
        width={16}
        height={16}
        alt=""
      />
      Sign in with {provider.name}
    </button>
  );
};
