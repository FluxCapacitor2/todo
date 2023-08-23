import { Button } from "@/components/ui/button";
import { trpc } from "@/util/trpc/trpc";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import { MdAddBox, MdCancel } from "react-icons/md";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "../ui/sheet";

export const NewProject = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (arg0: boolean) => void;
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();

  const { mutateAsync, isLoading } = trpc.projects.create.useMutation();

  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const projectId = await mutateAsync({ name: ref.current.value });
    ref.current.value = "";
    setOpened(false);
    utils.projects.list.invalidate();
    router.push(`/project/${projectId}`);
  };

  return (
    <Sheet open={opened} onOpenChange={setOpened}>
      <SheetContent className="w-screen max-w-xl">
        <SheetTitle>Create New Project</SheetTitle>
        <p className="my-4 text-base">
          Projects are the way you organize tasks. Each project has its own set
          of tasks, which can be further separated by labels, sub-lists, and
          more.
        </p>
        <form className="mt-4 flex flex-col gap-4" onSubmit={submit}>
          <Label htmlFor="newProjectName">Project name</Label>
          <Input
            type="text"
            id="newProjectName"
            ref={ref}
            required
            maxLength={100}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="gap-1">
              <MdAddBox />
              Create
            </Button>
            <SheetClose asChild>
              <Button variant="secondary" type="button" className="gap-1">
                <MdCancel />
                Cancel
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
