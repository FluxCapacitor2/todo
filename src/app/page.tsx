import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProjectCards } from "./ProjectCards";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <ProjectCards />
    </main>
  );
}
