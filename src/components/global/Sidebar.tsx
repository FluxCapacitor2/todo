"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
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
  MdChecklist,
  MdClose,
  MdDelete,
  MdMenu,
} from "react-icons/md";

const activeClass = "bg-gray-300 dark:bg-gray-600 transition-colors h-16";
const inactiveClass =
  "hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors h-16";

export const Sidebar = () => {
  const session = useSession();

  const { data, isLoading, isError } = trpc.projects.list.useQuery();

  const [shown, setShown] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => setShown(false), [pathname, searchParams]);

  return (
    <>
      <nav
        className={clsx(
          shown ? "absolute inset-0 z-20 flex" : "hidden",
          "sticky top-0 h-full min-h-screen min-w-[16rem] flex-col bg-gray-200 dark:bg-gray-900 md:flex"
        )}
      >
        <Link href="/profile">
          <div
            className={clsx(
              "flex items-center gap-2 p-4",
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
            <p className="text-sm font-bold">{session?.data?.user?.name}</p>
          </div>
        </Link>
        <Divider />
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
          <div className="flex h-24 w-full items-center justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <>
            <p>Error loading projects.</p>
          </>
        ) : (
          <>
            {data?.map((project) => (
              <ProjectItem
                id={project.id}
                name={project.name || "Untitled Project"}
                key={project.id}
              />
            ))}
          </>
        )}
        {shown && (
          <div
            className={clsx(
              inactiveClass,
              "flex cursor-pointer items-center gap-2 p-4"
            )}
            onClick={() => setShown(!shown)}
          >
            <MdClose />
            Close Menu
          </div>
        )}
      </nav>
      <Button
        variant="flat"
        className="absolute left-3 top-1 block md:hidden"
        onClick={() => setShown(!shown)}
      >
        <MdMenu />
      </Button>
    </>
  );
};

const Divider = () => (
  <div className="px-2">
    <hr className="h-1 w-full border-b border-t-0 border-gray-400 dark:border-gray-600" />
  </div>
);

const ProjectItem = ({ name, id }: { name: string; id: string }) => {
  const { mutateAsync, isLoading } = trpc.projects.delete.useMutation();
  const router = useRouter();
  const pathname = usePathname();

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
        <p className="grow">{name}</p>
        <Button
          variant="flat"
          className="text-gray-600 dark:text-gray-400"
          onClick={deleteProject}
        >
          {isLoading ? <Spinner /> : <MdDelete />}
        </Button>
      </div>
    </Link>
  );
};
