"use client";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MdShare } from "react-icons/md";

const ShareModal = dynamic(
  async () => (await import("./ShareModal")).ShareModal
);

export const ShareButton = ({ projectId }: { projectId: string }) => {
  const [modalShown, setModalShown] = useState(false);

  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (modalShown) {
      setLoad(true);
    }
  }, [modalShown]);

  return (
    <>
      <Button variant="subtle" onClick={() => setModalShown(true)}>
        <MdShare />
        Share
      </Button>
      {load && (
        <ShareModal
          projectId={projectId}
          opened={modalShown}
          close={() => setModalShown(false)}
        />
      )}
    </>
  );
};
