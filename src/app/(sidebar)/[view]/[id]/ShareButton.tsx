"use client";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdShare } from "react-icons/md";
import { ShareModal } from "./ShareModal";

export const ShareButton = ({ projectId }: { projectId: string }) => {
  const [modalShown, setModalShown] = useState(false);

  const [showPortal, setShowPortal] = useState(false);
  useEffect(() => setShowPortal(true), [setShowPortal]);

  return (
    <>
      <Button
        variant="subtle"
        onClick={() => setModalShown(true)}
        className="hidden md:flex"
      >
        <MdShare />
        Share
      </Button>
      <ShareModal
        projectId={projectId}
        opened={modalShown}
        close={() => setModalShown(false)}
      />
      {showPortal &&
        createPortal(
          <>
            <Button variant="flat" onClick={() => setModalShown(true)}>
              <MdShare className="h-5 w-5" />
            </Button>
          </>,
          document.getElementById("page-nav")!
        )}
    </>
  );
};
