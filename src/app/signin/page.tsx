import { TopNav } from "@/components/global/TopNav";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInButton } from "./SignInButton";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function SignIn() {
  const providers = await getProviders();

  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/projects");
  }

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-max pt-[30vh]">
        <Card>
          <CardHeader>
            <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
          </CardHeader>
          <CardContent>
            <p className="max-w-prose text-muted-foreground [text-wrap:balance]">
              When you sign in with a third-party provider, I receive your
              username, email address, and profile picture, which are solely
              used for display in the app and verifying account ownership. This
              app doesn&apos;t send any emails.
            </p>
          </CardContent>
          <CardFooter>
            {Object.values(providers!).map((provider) => (
              <div className="w-max" key={provider.id}>
                <SignInButton provider={provider} />
              </div>
            ))}
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
