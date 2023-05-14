"use client";

import { trpc } from "@/util/trpc/trpc";
import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

export const ViewSelector = ({ id }: { id: string }) => {
  const pathname = useSelectedLayoutSegment();
  const { data: project, isLoading, isError } = trpc.projects.get.useQuery(id);
  return (
    <>
      {isLoading ? (
        <div className="my-1 h-8 w-48 animate-pulse rounded-md bg-gray-500/50" />
      ) : (
        <h1 className="mb-2 text-2xl font-bold">{project?.name}</h1>
      )}

      <div className="flex">
        <PillButton href={`/project/${id}`} active={pathname === null}>
          Project
        </PillButton>
        <PillButton href={`/project/${id}/list`} active={pathname === "list"}>
          List
        </PillButton>
        <PillButton
          href={`/project/${id}/calendar`}
          active={pathname === "calendar"}
        >
          Calendar
        </PillButton>
      </div>
    </>
  );
};

const PillButton = ({
  children,
  href,
  active,
}: {
  children: ReactNode;
  href: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-1 transition-colors first:rounded-l-full last:rounded-r-full",
        active
          ? "bg-primary-300 dark:bg-primary-800"
          : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
      )}
    >
      <button>{children}</button>
    </Link>
  );
};
