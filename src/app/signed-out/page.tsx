import { getProviders } from "next-auth/react";
import { SignInButton } from "../signin/SignInButton";

export default async function Page() {
  const providers = await getProviders();

  return (
    <>
      <div className="mx-auto w-max">
        <div className="flex w-full flex-col gap-4 overflow-y-scroll rounded-lg bg-white p-12 dark:bg-gray-900">
          <div className="prose dark:prose-invert">
            <h2>Signed Out</h2>
            <p>You must be signed in to view this project.</p>
          </div>
          <div className="flex justify-end">
            {Object.values(providers!).map((provider) => (
              <SignInButton provider={provider} key={provider.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
