"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { Project } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { MdClose, MdDelete, MdHome, MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Sidebar = ({
  initialData,
}: {
  initialData: Project[] | undefined;
}) => {
  const session = useSession();

  const { data, isLoading, isError } = trpc.projects.list.useQuery(undefined, {
    initialData,
  });

  const [shown, setShown] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => setShown(false), [pathname, searchParams]);

  return (
    <div>
      <aside
        className={clsx(
          shown ? "absolute inset-0 z-20 flex" : "hidden",
          "h-screen flex-col gap-8 bg-gray-200 p-6 dark:bg-gray-900 md:flex"
        )}
      >
        <div className="flex w-48 items-center">
          {session.status === "authenticated" ? (
            <Link href="/profile">
              <div className="flex items-center gap-2">
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
          ) : (
            <>
              <Link className="font-medium underline" href="/signin">
                Sign In
              </Link>
            </>
          )}
        </div>
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
            <Link href="/">
              <div className="flex items-center gap-2">
                <MdHome />
                <p>Home</p>
              </div>
            </Link>
            {data?.map((project) => (
              <ProjectItem
                id={project.id}
                name={project.name ?? "Untitled Project"}
                key={project.id}
              />
            ))}
          </>
        )}
        {shown && (
          <Button
            variant="flat"
            className="absolute right-2 top-6"
            onClick={() => setShown(!shown)}
          >
            <MdClose />
          </Button>
        )}
      </aside>
      <Button
        variant="flat"
        className="absolute left-3 top-1 block md:hidden"
        onClick={() => setShown(!shown)}
      >
        <MdMenu />
      </Button>
    </div>
  );
};

const ProjectItem = ({ name, id }: { name: string; id: string }) => {
  const { mutateAsync, isLoading } = trpc.projects.delete.useMutation();
  const utils = trpc.useContext();

  const deleteProject = async () => {
    await mutateAsync(id);
    utils.projects.list.invalidate();
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        isLoading && "opacity-50"
      )}
    >
      <Link href={`/project/${id}`} className="grow">
        <p>{name}</p>
      </Link>
      <Button variant="subtle" onClick={deleteProject}>
        <MdDelete />
      </Button>
    </div>
  );
};
