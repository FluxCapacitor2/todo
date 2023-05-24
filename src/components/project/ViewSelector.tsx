"use client";

import { trpc } from "@/util/trpc/trpc";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BsFillGridFill } from "react-icons/bs";
import { MdCalendarToday, MdChecklist } from "react-icons/md";
import { PillButton } from "../ui/PillButton";

export const ViewSelector = ({ id }: { id: string }) => {
  const pathname = usePathname() ?? "";
  const {
    data: project,
    isLoading,
    isError,
  } = trpc.projects.get.useQuery(id, { refetchInterval: 600_000 });

  const [showPortal, setShowPortal] = useState(false);
  useEffect(() => setShowPortal(true), [setShowPortal]);

  return (
    <>
      <div className="hidden md:block">
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
              compact
            >
              Project
            </PillButton>
            <PillButton
              href={`/list/${id}`}
              active={pathname.startsWith("/list")}
              compact
            >
              List
            </PillButton>
            <PillButton
              href={`/calendar/${id}`}
              active={pathname.startsWith("/calendar")}
              compact
            >
              Calendar
            </PillButton>
          </div>
        )}
      </div>
      {showPortal &&
        createPortal(
          <>
            <div>
              <PillButton
                href={`/project/${id}`}
                active={pathname.startsWith("/project")}
              >
                <BsFillGridFill className="ml-1 h-5 w-5" />
              </PillButton>
              <PillButton
                href={`/list/${id}`}
                active={pathname.startsWith("/list")}
              >
                <MdChecklist className="h-5 w-5" />
              </PillButton>
              <PillButton
                href={`/calendar/${id}`}
                active={pathname.startsWith("/calendar")}
              >
                <MdCalendarToday className="mr-1 h-5 w-5" />
              </PillButton>
            </div>
          </>,
          document.getElementById("page-nav")!
        )}
    </>
  );
};
