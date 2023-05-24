import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInButton } from "../signin/SignInButton";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function Page() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/projects");
  }

  const providers = await getProviders();

  return (
    <>
      <div className="mx-auto w-max">
        <div className="flex w-full flex-col gap-4 rounded-lg p-12">
          <div className="prose dark:prose-invert">
            <h2>Signed Out</h2>
            <p>You must be signed in to view this project.</p>
          </div>
          <div className="flex flex-col">
            {Object.values(providers!).map((provider) => (
              <SignInButton provider={provider} key={provider.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
