import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/util/trpc/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const DeleteModal = ({
  projectId,
  projectName,
  opened,
  setOpened,
}: {
  projectId: string;
  projectName: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) => {
  const { mutateAsync, isLoading } = trpc.projects.delete.useMutation();
  const router = useRouter();
  const utils = trpc.useContext();

  const deleteProject = async () => {
    await mutateAsync(projectId);
    utils.projects.list.invalidate();
    router.push("/projects");
    toast.success("Project deleted!");
  };

  const [isCorrect, setCorrect] = useState(false);

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            project and all of its sections and tasks. Collaborators will not be
            able to view the project once it has been deleted.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="deletionProjectName">
          Type the name of the project to confirm: <b>{projectName}</b>
        </Label>
        <Input
          type="text"
          id="deletionProjectName"
          placeholder={projectName}
          onChange={(e) => setCorrect(e.currentTarget.value === projectName)}
        />
        <Button
          variant="destructive"
          className="gap-2"
          onClick={deleteProject}
          disabled={isLoading || !isCorrect}
        >
          {isLoading && <Spinner />}
          Delete Project
        </Button>
      </DialogContent>
    </Dialog>
  );
};
