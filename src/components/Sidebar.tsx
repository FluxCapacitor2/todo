"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { Spinner } from "./Spinner";
import { Project } from "@prisma/client";
import { FormEvent, useRef } from "react";
import { Button } from "./Button";
import clsx from "clsx";
import { MdClose, MdDelete, MdHome } from "react-icons/md";

export const Sidebar = ({
  initialData,
}: {
  initialData: Project[] | undefined;
}) => {
  const session = useSession();

  const { data, isLoading, isError } = trpc.projects.list.useQuery(undefined, {
    initialData,
  });

  return (
    <aside className="flex flex-col gap-8 h-screen bg-gray-200 dark:bg-gray-900 p-6">
      <div className="flex gap-2 items-center">
        {session.status === "authenticated" ? (
          <>
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
          </>
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

      <NewProject />
    </aside>
  );
};

const NewProject = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();

  const { mutateAsync, isLoading } = trpc.projects.create.useMutation();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (ref.current) {
      await mutateAsync({ name: ref.current.value });
      ref.current.value = "";
    }
    utils.projects.list.invalidate();
  };

  return (
    <form className="relative" onSubmit={submit}>
      <input
        type="text"
        placeholder="New project..."
        className="bg-transparent p-2 outline-none border-b border-b-gray-600 focus:border-b-white"
        ref={ref}
        disabled={isLoading}
      />
      <Button
        variant="subtle"
        className="absolute inset-y-1 right-0"
        type="submit"
        disabled={isLoading}
      >
        +
      </Button>
    </form>
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
