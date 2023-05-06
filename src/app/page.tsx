import SignIn from "./signin/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ProjectCards } from "./ProjectCards";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="max-w-prose mx-auto p-6 flex flex-col gap-4">
      {session === null ? (
        <>
          {/* @ts-expect-error RSC */}
          <SignIn />
        </>
      ) : (
        <ProjectCards />
      )}
    </main>
  );
}
