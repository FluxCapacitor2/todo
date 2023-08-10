import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteSection } from "@/hooks/section";

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
  const { deleteSection, isLoading } = useDeleteSection(projectId);
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
        >
          {isLoading && <Spinner />}
          Delete Section &ldquo;{sectionName}&rdquo;
        </Button>
      </DialogContent>
    </Dialog>
  );
};
