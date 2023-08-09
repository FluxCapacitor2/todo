import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarFeed } from "./CalendarFeed";
import { RequestNotificationPermission } from "./RequestNotificationPermission";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { TimePresets } from "./TimePresets";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <main className="px-6 md:pt-4">
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <p className="text-muted-foreground">
              Subscribe to your tasks as a calendar feed.
            </p>
          </CardHeader>
          <CardContent>
            <CalendarFeed />
            <p className="max-w-prose text-sm text-muted-foreground [text-wrap:balance]">
              <b>Note</b>: Anyone with the link can view your tasks! If you
              accidentally share the link, you can reset it by clicking the
              rotate button above.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Presets</CardTitle>
            <p className="text-muted-foreground">
              Change the recommended time presets for start and due dates and
              reminders.
            </p>
          </CardHeader>
          <CardContent>
            <TimePresets />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <p className="text-muted-foreground">
              Get notified for important due dates.
            </p>
          </CardHeader>
          <CardContent>
            <RequestNotificationPermission />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Theme Preference</CardTitle>
            <p className="text-muted-foreground">Applies to this device.</p>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sign Out</CardTitle>
            <p className="text-muted-foreground">Applies for this device.</p>
          </CardHeader>
          <CardContent>
            <SignOutButton />
          </CardContent>
        </Card>
      </div>
      <Link
        href="https://www.flaticon.com/free-icons/foursquare-check-in"
        className="mt-4 inline-block text-sm text-muted-foreground underline"
      >
        App icon created by hqrloveq on Flaticon
      </Link>
    </main>
  );
}
