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
    <main className="max-w-prose mx-auto p-6 flex flex-col gap-4">
      <ProjectCards />
    </main>
  );
}
