import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInButton } from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/");
  }

  return (
    <>
      <main className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-12">
        <h1 className="my-6 text-3xl font-bold">Sign In</h1>
        {Object.values(providers!).map((provider) => (
          <SignInButton provider={provider} key={provider.id} />
        ))}
      </main>
    </>
  );
}
