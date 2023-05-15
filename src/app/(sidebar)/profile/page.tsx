import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";
import { RequestNotificationPermission } from "./RequestNotificationPermission";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <main className="px-6 pt-4">
      <div className="mb-8 flex items-center gap-2">
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
      <div className="flex w-full flex-col gap-2 sm:max-w-max">
        <RequestNotificationPermission />
        <SignOutButton />
      </div>
      <Link
        href="https://www.flaticon.com/free-icons/foursquare-check-in"
        className="mt-12 text-sm underline"
      >
        App icon created by hqrloveq on Flaticon
      </Link>
    </main>
  );
}
