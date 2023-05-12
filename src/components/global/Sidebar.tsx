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
          shown ? "flex absolute inset-0 z-20" : "hidden",
          "flex-col gap-8 h-screen bg-gray-200 dark:bg-gray-900 p-6 md:flex"
        )}
      >
        <div className="flex items-center w-48">
          {session.status === "authenticated" ? (
            <Link href="/profile">
              <div className="flex gap-2 items-center">
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
                <p className="font-bold text-sm">{session?.data?.user?.name}</p>
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
          <div className="flex justify-center items-center w-full h-24">
            <Spinner />
          </div>
        ) : isError ? (
          <>
            <p>Error loading projects.</p>
          </>
        ) : (
          <>
            <Link href="/">
              <div className="flex gap-2 items-center">
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
            className="absolute top-6 right-2"
            onClick={() => setShown(!shown)}
          >
            <MdClose />
          </Button>
        )}
      </aside>
      <Button
        variant="flat"
        className="block absolute top-1 left-3 md:hidden"
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
        "flex justify-between items-center",
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
