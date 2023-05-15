import { ViewSelector } from "@/components/project/ViewSelector";
import { ReactNode } from "react";

export default function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  return (
    <main className="px-2 pt-4 md:px-6">
      <ViewSelector id={id} />
      {children}
    </main>
  );
}
