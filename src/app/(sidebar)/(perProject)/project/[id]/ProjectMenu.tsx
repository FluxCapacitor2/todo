import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/util/trpc/trpc";
import { useState } from "react";
import { MdDelete, MdMoreHoriz, MdShare } from "react-icons/md";
import { DeleteModal } from "./DeleteModal";
import { ShareModal } from "./ShareModal";

export const ProjectMenu = ({ id }: { id: string }) => {
  const [shareModalShown, setShareModalShown] = useState(false);
  const [deleteModalShown, setDeleteModalShown] = useState(false);

  const { data: project } = trpc.projects.get.useQuery(id);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MdMoreHoriz />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShareModalShown(true)}>
            <MdShare /> Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteModalShown(true)}>
            <MdDelete /> Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ShareModal
        projectId={id}
        opened={shareModalShown}
        close={() => setShareModalShown(false)}
      />
      {project?.name !== undefined && (
        <DeleteModal
          projectId={id}
          projectName={project?.name}
          opened={deleteModalShown}
          setOpened={setDeleteModalShown}
        />
      )}
    </>
  );
};
