"use client";

import { ViewSelector } from "@/components/project/ViewSelector";
import { ReactNode } from "react";

export default function ProjectViewLayout({
  params: { view, id },
  children,
}: {
  params: { view: string; id: string };
  children: ReactNode;
}) {
  return (
    <main className="conditional-overflow-hidden flex h-full flex-col md:px-6 md:pt-4">
      <ViewSelector id={id} className="mb-2" />
      {children}
    </main>
  );
}
