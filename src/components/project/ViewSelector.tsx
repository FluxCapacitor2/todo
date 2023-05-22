"use client";

import { trpc } from "@/util/trpc/trpc";
import { usePathname } from "next/navigation";
import { PillButton } from "../ui/PillButton";

export const ViewSelector = ({ id }: { id: string }) => {
  const pathname = usePathname() ?? "";
  const { data: project, isLoading, isError } = trpc.projects.get.useQuery(id);
  return (
    <>
      {isLoading ? (
        <div className="my-1 h-8 w-48 animate-pulse rounded-md bg-gray-500/50" />
      ) : (
        <h1 className="mb-2 text-2xl font-bold">{project?.name}</h1>
      )}

      {!isError && (
        <div className="flex">
          <PillButton
            href={`/project/${id}`}
            active={pathname.startsWith("/project")}
          >
            Project
          </PillButton>
          <PillButton
            href={`/list/${id}`}
            active={pathname.startsWith("/list")}
          >
            List
          </PillButton>
          <PillButton
            href={`/calendar/${id}`}
            active={pathname.startsWith("/calendar")}
          >
            Calendar
          </PillButton>
        </div>
      )}
    </>
  );
};
