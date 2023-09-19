"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CalendarFeed } from "./CalendarFeed";
import { RequestNotificationPermission } from "./RequestNotificationPermission";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { TimePresets } from "./TimePresets";

export default function ProfilePage() {
  const session = useSession();

  return (
    <main className="px-6 md:pt-4">
      <div className="mb-8 flex items-center gap-2">
        {session.status !== "authenticated" ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </>
        ) : (
          <>
            <Image
              width={48}
              height={48}
              src={session.data!.user!.image!}
              alt="Profile picture"
              unoptimized
              className="rounded-full"
              priority
            />
            <div className="ml-2">
              <h1 className="text-3xl font-bold">{session.data!.user!.name}</h1>
              <p className="text-sm text-muted-foreground">
                {session.data!.user!.email}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-12 px-4">
        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Archived Projects</h2>
          <p className="mb-2 text-muted-foreground">
            Free up space in your sidebar by archiving projects, and restore
            them here.
          </p>

          <Link href="/projects/archived">
            <Button>View Archived Projects</Button>
          </Link>
        </div>

        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-muted-foreground">
            Subscribe to your tasks as a calendar feed.
          </p>

          <CalendarFeed />
          <p className="max-w-prose text-sm text-muted-foreground [text-wrap:balance]">
            <b>Note</b>: Anyone with the link can view your tasks! If you
            accidentally share the link, you can reset it by clicking the rotate
            button above.
          </p>
        </div>
        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Time Presets</h2>
          <p className="text-muted-foreground">
            Change the recommended time presets for start and due dates and
            reminders.
          </p>

          <TimePresets />
        </div>
        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            Get notified for important due dates.
          </p>

          <RequestNotificationPermission />
        </div>
        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Theme Preference</h2>
          <p className="text-muted-foreground">Applies to this device.</p>

          <ThemeToggle />
        </div>
        <div className="w-full max-w-prose border-b pb-12">
          <h2 className="text-2xl font-bold">Sign Out</h2>
          <p className="text-muted-foreground">Applies for this device.</p>

          <SignOutButton />
        </div>
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
