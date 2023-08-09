"use client";

import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/util/trpc/trpc";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdChecklist, MdUnarchive } from "react-icons/md";

export const ArchivedView = ({ id: projectId }: { id: string }) => {
  const { data, isLoading } = trpc.sections.getArchived.useQuery(projectId);

  const utils = trpc.useContext();
  const router = useRouter();

  const { mutateAsync: updateSection, isLoading: isMutating } =
    trpc.sections.update.useMutation({
      onSettled: () => {
        utils.sections.getArchived.invalidate(projectId);
      },
    });

  const unarchive = (id: number) => {
    updateSection({ id, archived: false })
      .then(() => {
        router.push(`/project/${projectId}`);
        toast.success("Section unarchived!");
      })
      .catch(() => {
        toast.error("There was a problem unarchiving that section!");
      });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data
            ?.filter((it) => it.archived)
            .map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{section._count?.tasks} tasks</p>
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => unarchive(section.id)}
                  >
                    <MdUnarchive /> Unarchive
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-primary-100 p-6">
            <MdChecklist size={36} />
          </div>
          <p className="w-96">
            <strong>You don&apos;t have any archived sections.</strong> Click
            the &quot;Archive Section&quot; button in a section&apos;s dropdown
            menu to archive it.
          </p>
          <Button onClick={() => router.push(`/project/${projectId}`)}>
            Go Back
          </Button>
        </div>
      )}
    </>
  );
};
