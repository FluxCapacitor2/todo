import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateProject } from "@/hooks/project";
import { trpc } from "@/util/trpc/trpc";
import { useState } from "react";
import {
  MdArchive,
  MdDelete,
  MdMoreHoriz,
  MdShare,
  MdUnarchive,
} from "react-icons/md";
import { DeleteModal } from "./DeleteModal";
import { ShareModal } from "./ShareModal";

export const ProjectMenu = ({ id }: { id: string }) => {
  const [shareModalShown, setShareModalShown] = useState(false);
  const [deleteModalShown, setDeleteModalShown] = useState(false);

  const [open, setOpen] = useState(false);

  const { data: project } = trpc.projects.get.useQuery(id, { enabled: open });

  const { updateProject, isMutating } = useUpdateProject(id);

  return (
    <>
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MdMoreHoriz />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShareModalShown(true)}
            disabled={project?.archived}
          >
            <MdShare /> Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteModalShown(true)}
            disabled={project === undefined}
          >
            <MdDelete /> Delete Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateProject({ archived: !project?.archived })}
            disabled={isMutating || project === undefined}
          >
            {project?.archived ? (
              <>
                <MdUnarchive /> Unarchive Project
              </>
            ) : (
              <>
                <MdArchive /> Archive Project
              </>
            )}
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
