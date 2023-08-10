"use client";

import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { BsFillGridFill } from "react-icons/bs";
import {
  MdCheckCircle,
  MdChecklist,
  MdError,
  MdGroups,
  MdMenu,
} from "react-icons/md";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const activeClass = "transition-colors bg-secondary";
const inactiveClass = "transition-colors hover:bg-secondary/80";

export const Sidebar = () => {
  const [shown, setShown] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => setShown(false), [pathname, searchParams]);

  useLayoutEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768) {
        setShown(false);
      }
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  });

  return (
    <>
      <Sheet open={shown} onOpenChange={setShown}>
        <div className="absolute right-1 top-3 z-50 flex justify-end md:hidden">
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShown(!shown)}
            >
              <MdMenu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent className="w-screen max-w-xl p-2" side="left">
          <SidebarContents isModal={true} />
        </SheetContent>
      </Sheet>
      <SidebarContents isModal={false} />
    </>
  );
};

const SidebarContents = ({ isModal }: { isModal: boolean }) => {
  const session = useSession();
  const pathname = usePathname();

  const { data, isLoading, isError } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: 300_000, // 5 minutes
  });

  const { data: invitations } = trpc.invitation.listIncoming.useQuery(
    undefined,
    {
      refetchInterval: 300_000, // 5 minutes
    }
  );

  return (
    <nav
      className={clsx(
        isModal ? "z-20 flex" : "z-20 hidden border-r bg-background md:flex",
        "sticky top-0 h-screen min-w-[16rem] flex-col"
      )}
    >
      <Link href="/profile">
        <div
          className={clsx(
            "flex items-center gap-2 p-4 font-medium",
            pathname === "/profile" ? activeClass : inactiveClass
          )}
        >
          {session?.data?.user?.image && (
            <Image
              src={session.data.user.image}
              alt="User profile image"
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
          )}
          <p>{session?.data?.user?.name}</p>
        </div>
      </Link>
      <Divider />
      <Link href="/invitations">
        <div
          className={clsx(
            "flex items-center gap-2 p-4 font-medium",
            pathname === "/invitations" ? activeClass : inactiveClass
          )}
        >
          <MdGroups />
          <p>Invitations</p>
          {invitations && invitations.length > 0 && (
            <p className="rounded-md bg-red-500 px-1 text-white">
              {invitations.length}
            </p>
          )}
        </div>
      </Link>
      <Link href="/projects">
        <div
          className={clsx(
            "flex items-center gap-2 p-4 font-medium",
            pathname === "/projects" ? activeClass : inactiveClass
          )}
        >
          <BsFillGridFill />
          <p>Projects</p>
        </div>
      </Link>
      <Link href="/tasks">
        <div
          className={clsx(
            "flex items-center gap-2 p-4 font-medium",
            pathname === "/tasks" ? activeClass : inactiveClass
          )}
        >
          <MdChecklist />
          <p>Tasks</p>
        </div>
      </Link>
      <Link href="/completed">
        <div
          className={clsx(
            "flex items-center gap-2 p-4 font-medium",
            pathname === "/completed" ? activeClass : inactiveClass
          )}
        >
          <MdCheckCircle />
          <p>Completed</p>
        </div>
      </Link>
      <Divider />
      {isLoading ? (
        <div className="flex w-full flex-col">
          {new Array(4).fill(undefined).map((_, i) => (
            <div
              className="flex h-16 items-center gap-2 p-4 font-medium"
              key={i}
            >
              <div className="h-5 w-32 animate-pulse bg-gray-300 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="flex items-center gap-2 p-4 font-bold text-red-500">
          <MdError />
          Error loading projects.
        </p>
      ) : (
        <>
          {data?.map((project) => (
            <ProjectItem
              id={project.id}
              ownerId={project.ownerId}
              name={project.name || "Untitled Project"}
              key={project.id}
            />
          ))}
        </>
      )}
    </nav>
  );
};

const Divider = () => (
  <div className="px-2">
    <hr className="h-1 w-full border-b border-t-0 border-gray-400 dark:border-gray-600" />
  </div>
);

const ProjectItem = ({
  name,
  ownerId,
  id,
}: {
  name: string;
  ownerId: string;
  id: string;
}) => {
  const pathname = usePathname();

  const session = useSession();
  const isCollaborator =
    session.status === "authenticated" &&
    ownerId !== (session.data as ExtSession).id;

  const active = pathname?.startsWith(`/project/${id}`);

  return (
    <Link href={`/project/${id}`}>
      <div
        className={clsx(
          "flex items-center justify-between p-4 font-medium",
          active ? activeClass : inactiveClass
        )}
      >
        <p className="grow">
          <span className="mr-2">{name}</span>
          {isCollaborator && (
            <MdGroups className="inline fill-gray-700 dark:fill-gray-300" />
          )}
        </p>
      </div>
    </Link>
  );
};
