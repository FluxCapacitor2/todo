"use client";

import { ProjectMenu } from "@/app/(sidebar)/(perProject)/project/[id]/ProjectMenu";
import { cn } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Skeleton } from "../ui/skeleton";

export const ViewSelector = ({
  id,
  className,
}: {
  id: string;
  className: string;
}) => {
  const {
    data: project,
    isLoading,
    isError,
  } = trpc.projects.get.useQuery(id, { refetchInterval: 600_000 });

  const pathname = usePathname();

  return (
    <div className={cn("px-2", className)}>
      {isLoading ? (
        <Skeleton className="mb-2 h-10 w-64" />
      ) : (
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
          {project?.name}
          {project?.archived === true && (
            <Badge variant="outline">Archived</Badge>
          )}
          <ProjectMenu id={id} />
        </h1>
      )}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={`/project/${id}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={pathname?.startsWith("/project/")}
              >
                Project
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={`/list/${id}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={pathname?.startsWith("/list/")}
              >
                List
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={`/archived/${id}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={pathname?.startsWith("/archived/")}
              >
                Archived
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
