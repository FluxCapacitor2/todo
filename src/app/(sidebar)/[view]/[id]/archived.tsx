"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { trpc } from "@/util/trpc/trpc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdArrowBack, MdChecklist, MdUnarchive } from "react-icons/md";

export const ArchivedView = ({ id: projectId }: { id: string }) => {
  const { data, isLoading } = trpc.sections.getArchived.useQuery(projectId);

  const utils = trpc.useContext();
  const { mutateAsync: updateSection, isLoading: isMutating } =
    trpc.sections.update.useMutation({
      onSettled: () => {
        utils.sections.getArchived.invalidate(projectId);
      },
    });

  const unarchive = (id: number) => {
    updateSection({ id, archived: false })
      .then(() => {
        toast.success("Section unarchived!");
      })
      .catch(() => {
        toast.error("There was a problem unarchiving that section!");
      });
  };

  const router = useRouter();

  return (
    <>
      <Link href={`/project/${projectId}`} className="text-gray-500">
        <MdArrowBack className="mr-1 inline" />
        Back
      </Link>
      <h2 className="text-3xl font-bold">Archived</h2>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {data
            ?.filter((it) => it.archived)
            .map((section) => (
              <div
                className="w-96 rounded-md border border-gray-500 p-4"
                key={section.id}
              >
                <h2 className="text-lg font-medium">{section.name}</h2>
                <p>{section._count?.tasks} tasks</p>
                <Button
                  variant="subtle"
                  className="mt-2"
                  onClick={() => unarchive(section.id)}
                >
                  <MdUnarchive /> Unarchive
                </Button>
              </div>
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
          <Button
            variant="primary"
            onClick={() => router.push(`/project/${projectId}`)}
          >
            Go Back
          </Button>
        </div>
      )}
    </>
  );
};
