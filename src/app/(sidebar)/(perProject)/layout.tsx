"use client";

import { ViewSelector } from "@/components/project/ViewSelector";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function ProjectViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const id = params!.id as string;
  return (
    <main className="flex h-full flex-col overflow-hidden md:pl-6 md:pt-4">
      <ViewSelector id={id} className="mb-2" />
      <div className="h-full overflow-y-auto">{children}</div>
    </main>
  );
}
