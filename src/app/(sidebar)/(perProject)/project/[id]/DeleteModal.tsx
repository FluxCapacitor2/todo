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
import { graphql } from "@/gql";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "urql";

const DeleteProjectMutation = graphql(`
  mutation deleteProject($id: String!) {
    deleteProject(id: $id) {
      id
    }
  }
`);

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
  const router = useRouter();

  const [{ fetching }, _deleteProject] = useMutation(DeleteProjectMutation);

  const deleteProject = async () => {
    await _deleteProject({ id: projectId });
    router.push("/projects");
    toast.success("Project deleted!");
    setOpened(false);
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
          disabled={fetching || !isCorrect}
        >
          {fetching && <Spinner />}
          Delete Project
        </Button>
      </DialogContent>
    </Dialog>
  );
};
