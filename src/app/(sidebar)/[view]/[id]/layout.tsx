import { ViewSelector } from "@/components/project/ViewSelector";
import { ReactNode } from "react";
import { ShareButton } from "./ShareButton";

export default function Layout({
  params: { view, id },
  children,
}: {
  params: { view: string; id: string };
  children: ReactNode;
}) {
  return (
    <main className="px-2 pt-4 md:px-6">
      <div className="flex justify-between">
        <div>
          <ViewSelector id={id} />
        </div>
        <div>
          <ShareButton projectId={id} />
        </div>
      </div>
      {children}
    </main>
  );
}
