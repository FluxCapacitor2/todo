"use client";

import { NewProject } from "@/components/global/NewProjectModal";
import { Sidebar } from "@/components/global/Sidebar";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { MdOfflineBolt } from "react-icons/md";

const CommandMenu = dynamic(
  async () => (await import("./CommandMenu")).CommandMenu
);

const useOnline = () => {
  const [online, setOnline] = useState(
    typeof window === "undefined" || navigator.onLine
  );

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  });

  return online;
};

export default function SignedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const online = useOnline();

  useEffect(() => {
    if (online) {
      document.body.classList.remove("offline");
      document.body.classList.add("online");
    } else {
      document.body.classList.remove("online");
      document.body.classList.add("offline");
    }
  }, [online]);

  const [newProjectOpen, setNewProjectOpen] = useState(false);

  return (
    <>
      {!online && (
        <div className="flex h-10 w-full flex-wrap items-center justify-center gap-2 bg-red-500 text-white">
          <MdOfflineBolt />
          <span className="font-bold">You are offline!</span>
          <span className="hidden md:inline">
            Please reconnect to continue using the app.
          </span>
        </div>
      )}
      <div className="flex h-screen w-screen flex-col overflow-hidden md:flex-row">
        <Sidebar newProject={() => setNewProjectOpen(true)} />
        <div className="h-screen w-full overflow-x-hidden pt-3">{children}</div>
      </div>
      <NewProject opened={newProjectOpen} setOpened={setNewProjectOpen} />
      <Toaster position="top-right" />
      <CommandMenu newProject={() => setNewProjectOpen(true)} />
    </>
  );
}
