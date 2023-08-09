"use client";

import { ViewSelector } from "@/components/project/ViewSelector";
import { ReactNode } from "react";

export default function Layout({
  params: { view, id },
  children,
}: {
  params: { view: string; id: string };
  children: ReactNode;
}) {
  return (
    <main className="md:px-6 md:pt-4">
      <ViewSelector id={id} className="mb-2" />
      {children}
    </main>
  );
}
