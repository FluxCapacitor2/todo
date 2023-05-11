import { trpc } from "@/util/trpc/trpc";
import { useRef, FormEvent } from "react";
import { MdAddBox, MdCancel } from "react-icons/md";
import { Button } from "../ui/Button";
import { CustomDialog, DialogTitle } from "../ui/CustomDialog";
import { TextField } from "../ui/TextField";

export const NewProjectModal = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();

  const { mutateAsync, isLoading } = trpc.projects.create.useMutation();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (ref.current) {
      await mutateAsync({ name: ref.current.value });
      ref.current.value = "";
      close();
    }
    utils.projects.list.invalidate();
  };

  return (
    <CustomDialog opened={open} close={close}>
      <DialogTitle>Create New Project</DialogTitle>
      <p className="text-base my-4">
        Projects are the way you organize tasks. Each project has its own set of
        tasks, which can be further separated by labels, sub-lists, and more.
      </p>
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField ref={ref} placeholder="Add a name..." />
        <div className="flex gap-2">
          <Button variant="primary" type="submit" disabled={isLoading}>
            <MdAddBox />
            Create
            {ref.current?.value}
          </Button>
          <Button variant="subtle" type="button" onClick={close}>
            <MdCancel />
            Cancel
            {ref.current?.value}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};
