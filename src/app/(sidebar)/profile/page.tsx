import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarFeed } from "./CalendarFeed";
import { RequestNotificationPermission } from "./RequestNotificationPermission";
import { SignOutButton } from "./SignOutButton";

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
      <div className="my-8">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <p>Subscribe to your tasks as a calendar feed.</p>
        <CalendarFeed />
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p>Get notified for important due dates.</p>
        <RequestNotificationPermission />
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-bold">Sign Out</h2>
        <p>Applies for this device.</p>
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
