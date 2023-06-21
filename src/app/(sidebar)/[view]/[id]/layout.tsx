"use client";

import { ViewSelector } from "@/components/project/ViewSelector";
import { Button } from "@/components/ui/Button";
import { MenuItem, MenuItems } from "@/components/ui/CustomMenu";
import { Menu } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdMoreHoriz, MdShare, MdViewKanban } from "react-icons/md";
import { ShareModal } from "./ShareModal";

export default function Layout({
  params: { view, id },
  children,
}: {
  params: { view: string; id: string };
  children: ReactNode;
}) {
  const [showPortal, setShowPortal] = useState(false);
  useEffect(() => setShowPortal(true), [setShowPortal]);

  const pathname = usePathname();

  return (
    <main className="px-2 md:px-6 md:pt-4">
      {!pathname?.includes("/archived/") && (
        <div className="flex justify-between">
          <div>
            <ViewSelector id={id} />
          </div>
          <div>
            <ProjectMenu id={id} />
            {showPortal && (
              <>
                {createPortal(
                  <ProjectMenu id={id} />,
                  document.getElementById("page-nav")!
                )}
              </>
            )}
          </div>
        </div>
      )}
      {children}
    </main>
  );
}

const ProjectMenu = ({ id }: { id: string }) => {
  const [shareModalShown, setShareModalShown] = useState(false);

  const router = useRouter();

  return (
    <>
      <Menu as="div" className="relative">
        {({ open, close }) => (
          <>
            <MenuItems
              {...{ open, close }}
              button={
                <Menu.Button as={Button} variant="flat">
                  <MdMoreHoriz />
                </Menu.Button>
              }
            >
              <MenuItem onClick={() => setShareModalShown(true)}>
                <MdShare /> Share
              </MenuItem>
              <MenuItem onClick={() => router.push(`/archived/${id}`)}>
                <MdViewKanban /> View Archived Sections
              </MenuItem>
            </MenuItems>
          </>
        )}
      </Menu>
      <ShareModal
        projectId={id}
        opened={shareModalShown}
        close={() => setShareModalShown(false)}
      />
    </>
  );
};
