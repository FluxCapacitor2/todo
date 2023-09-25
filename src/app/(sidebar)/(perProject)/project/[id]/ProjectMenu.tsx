import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  MdArchive,
  MdDelete,
  MdMoreHoriz,
  MdShare,
  MdUnarchive,
} from "react-icons/md";
import { useMutation, useQuery } from "urql";
import {
  GetProjectMetaQuery,
  UpdateProjectMutation,
} from "../../../../queries";
import { DeleteModal } from "./DeleteModal";
import { ShareModal } from "./ShareModal";

export const ProjectMenu = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const session = useSession();

  const [shareModalShown, setShareModalShown] = useState(false);
  const [deleteModalShown, setDeleteModalShown] = useState(false);

  const [{ data, fetching }] = useQuery({
    query: GetProjectMetaQuery,
    variables: { id },
    pause: !open,
  });
  const project = data?.me?.project;

  const [{ fetching: isMutating }, updateProject] = useMutation(
    UpdateProjectMutation
  );

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
            disabled={
              project?.archived || project?.ownerId !== session.data?.id
            }
          >
            <MdShare /> Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteModalShown(true)}
            disabled={
              fetching ||
              project === undefined ||
              project.ownerId !== session.data?.id
            }
          >
            <MdDelete /> Delete Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateProject({ id: project!.id, archived: !project?.archived })
            }
            disabled={
              isMutating ||
              project === undefined ||
              project.ownerId !== session.data?.id
            }
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
      {!!project?.name && (
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
