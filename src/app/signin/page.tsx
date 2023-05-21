import { TopNav } from "@/components/global/TopNav";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { SignInButton } from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/projects");
  }

  return (
    <>
      <TopNav />
      <main className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2">
        <h1 className="mb-4 text-6xl font-black">Sign In</h1>
        <p>
          Authentication is handled via GitHub. We receive your username, email
          address, and profile picture, which are solely used for display in the
          app and verifying account ownership.
        </p>
        {Object.values(providers!).map((provider) => (
          <div className="w-max" key={provider.id}>
            <SignInButton provider={provider} />
          </div>
        ))}
      </main>
    </>
  );
}
