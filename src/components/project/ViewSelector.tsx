"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

export const ViewSelector = ({ id }: { id: string }) => {
  const pathname = useSelectedLayoutSegment();
  return (
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
