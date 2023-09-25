import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { graphql } from "@/gql";
import { useMutation } from "urql";

const DeleteSectionMutation = graphql(`
  mutation deleteSection($id: Int!) {
    deleteSection(id: $id) {
      id
      name
      archived
    }
  }
`);

export const DeleteSectionModal = ({
  opened,
  setOpened,
  projectId,
  sectionId,
  sectionName,
}: {
  opened: boolean;
  setOpened: (arg0: boolean) => void;
  projectId: string;
  sectionId: number;
  sectionName: string;
}) => {
  const [{ fetching }, deleteSection] = useMutation(DeleteSectionMutation);

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Section</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all tasks
            in this section.
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={async () => {
            await deleteSection({ id: sectionId });
            setOpened(false);
          }}
          disabled={fetching}
        >
          {fetching && <Spinner />}
          Delete Section &ldquo;{sectionName}&rdquo;
        </Button>
      </DialogContent>
    </Dialog>
  );
};
