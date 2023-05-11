import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <main className="px-6 pt-4">
      <div className="flex gap-2 items-center mb-8">
        <Image
          width={48}
          height={48}
          src={session.user.image!}
          alt="Profile picture"
          unoptimized
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{session.user.name}</h1>
          <p>{session.user.email}</p>
        </div>
      </div>
      <SignOutButton />
    </main>
  );
}
