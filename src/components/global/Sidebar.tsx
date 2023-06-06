"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFillGridFill } from "react-icons/bs";
import {
  MdCalendarMonth,
  MdCheckCircle,
  MdChecklist,
  MdClose,
  MdDelete,
  MdError,
  MdGroups,
  MdMenu,
} from "react-icons/md";

const activeClass = "bg-gray-300 dark:bg-gray-600 transition-colors h-16";
const inactiveClass =
  "hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors h-16";

export const Sidebar = () => {
  const session = useSession();

  const { data, isLoading, isError } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: 300_000, // 5 minutes
  });

  const { data: invitations } = trpc.invitation.listIncoming.useQuery(
    undefined,
    {
      refetchInterval: 300_000, // 5 minutes
    }
  );

  const [shown, setShown] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => setShown(false), [pathname, searchParams]);

  return (
    <>
      <nav
        className={clsx(
          shown ? "fixed inset-0 z-20 flex" : "sticky hidden",
          "top-0 h-full min-h-screen min-w-[16rem] flex-col bg-gray-200 dark:bg-gray-900 md:flex"
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
        <Link href="/calendar">
          <div
            className={clsx(
              "flex items-center gap-2 p-4 font-medium",
              pathname === "/calendar" ? activeClass : inactiveClass
            )}
          >
            <MdCalendarMonth />
            <p>Calendar</p>
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
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 bg-gray-800 p-2 md:hidden">
        <Button
          variant="flat"
          onClick={() => setShown(!shown)}
          aria-label="Toggle navigation"
        >
          {shown ? (
            <MdClose className="h-5 w-5" />
          ) : (
            <MdMenu className="h-5 w-5" />
          )}
        </Button>
        <div
          id="page-nav"
          className={clsx(shown ? "hidden" : "flex items-center gap-2")}
        />
      </div>
    </>
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
  const { mutateAsync, isLoading } = trpc.projects.delete.useMutation();
  const router = useRouter();
  const pathname = usePathname();

  const session = useSession();
  const isCollaborator =
    session.status === "authenticated" &&
    ownerId !== (session.data as ExtSession).id;

  const active = pathname?.startsWith(`/project/${id}`);

  const utils = trpc.useContext();

  const deleteProject = async () => {
    await mutateAsync(id);
    utils.projects.list.invalidate();
    if (active) {
      router.push("/projects");
    }
    toast.success("Project deleted!");
  };

  return (
    <Link href={`/project/${id}`}>
      <div
        className={clsx(
          "flex items-center justify-between p-4 font-medium",
          isLoading && "opacity-50",
          active ? activeClass : inactiveClass
        )}
      >
        <p className="grow">
          <span className="mr-2">{name}</span>
          {isCollaborator && (
            <MdGroups className="inline fill-gray-700 dark:fill-gray-300" />
          )}
        </p>
        <Button
          variant="flat"
          className="text-gray-600 dark:text-gray-400"
          onClick={deleteProject}
          aria-label="Delete Project"
        >
          {isLoading ? <Spinner /> : <MdDelete />}
        </Button>
      </div>
    </Link>
  );
};
