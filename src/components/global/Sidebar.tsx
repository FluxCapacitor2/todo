import { ProjectMenu } from "@/app/(sidebar)/(perProject)/project/[id]/ProjectMenu";
import { ExtSession } from "@/pages/api/auth/[...nextauth]";
import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BsFillGridFill } from "react-icons/bs";
import {
  MdAddBox,
  MdCheckCircle,
  MdChecklist,
  MdError,
  MdGroups,
  MdMenu,
} from "react-icons/md";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";

const activeClass = "transition-colors bg-secondary";
const inactiveClass = "transition-colors hover:bg-secondary/80";

export const Sidebar = ({ newProject }: { newProject: () => void }) => {
  const [shown, setShown] = useState(false);

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
            <Button size="icon" variant="ghost">
              <MdMenu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent className="w-screen max-w-xl p-2" side="left">
          <SidebarContents
            isModal={true}
            newProject={newProject}
            close={() => setShown(false)}
          />
        </SheetContent>
      </Sheet>
      <SidebarContents
        isModal={false}
        newProject={newProject}
        close={() => {}}
      />
      <Suspense>
        <HideOnRouteChange hide={() => setShown(false)} />
      </Suspense>
    </>
  );
};

const HideOnRouteChange = ({ hide }: { hide: () => void }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideSidebar = useMemo(() => hide, []);

  useEffect(hideSidebar, [pathname, searchParams, hideSidebar]);

  return <></>;
};

const SidebarContents = ({
  isModal,
  newProject,
  close,
}: {
  isModal: boolean;
  newProject: () => void;
  close: () => void;
}) => {
  const session = useSession();
  const pathname = usePathname();

  const { data, isLoading, isError } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: 60_000 * 10, // 10 minutes
  });

  return (
    <nav
      className={clsx(
        isModal ? "flex" : "z-20 hidden border-r bg-background md:flex",
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
          {session.status === "loading" ? (
            <>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <>
              {session.data?.user?.image && (
                <Image
                  src={session.data.user.image}
                  alt="User profile image"
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized
                  priority
                />
              )}
              <p>{session?.data?.user?.name}</p>
            </>
          )}
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
              className="flex h-14 items-center gap-2 p-4 font-medium"
              key={i}
            >
              <Skeleton className="h-6 w-32" />
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
          <Divider />

          <button
            className={clsx(
              "flex items-center justify-start gap-2 p-4 font-medium",
              inactiveClass
            )}
            onClick={() => {
              close();
              newProject();
            }}
          >
            <MdAddBox /> New Project
          </button>
        </>
      )}
    </nav>
  );
};

const Divider = () => (
  <hr className="h-0 w-full border-b border-t-0 border-border" />
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
    <Link href={`/project/${id}`} className="group">
      <div
        className={clsx(
          "flex items-center justify-between p-4 font-medium",
          active ? activeClass : inactiveClass
        )}
      >
        <p className="grow">
          <span className="mr-2 overflow-hidden truncate">{name}</span>
          {isCollaborator && (
            <MdGroups className="inline fill-gray-700 dark:fill-gray-300" />
          )}
          <div className="mr-auto inline-block h-0 opacity-0 transition-opacity group-hover:opacity-100">
            <ProjectMenu id={id} />
          </div>
        </p>
      </div>
    </Link>
  );
};
