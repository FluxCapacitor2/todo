import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ProjectCards } from "./ProjectCards";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="mx-auto flex max-w-prose flex-col gap-4 p-6">
      <ProjectCards />
    </main>
  );
}
