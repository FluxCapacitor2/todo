import { getProviders } from "next-auth/react";
import { SignInButton } from "./SignInButton";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function SignIn() {
  const providers = await getProviders();

  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/");
  }

  return (
    <>
      <main className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-12">
        {Object.values(providers!).map((provider) => (
          <SignInButton provider={provider} key={provider.id} />
        ))}
      </main>
    </>
  );
}
