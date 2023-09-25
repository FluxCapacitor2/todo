"use client";

import { GetArchivedSectionsQuery, UpdateSectionMutation } from "@/app/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { MdChecklist, MdUnarchive } from "react-icons/md";
import { useMutation, useQuery } from "urql";

export default function ArchivedView({
  params: { id: projectId },
}: {
  params: { id: string };
}) {
  const [{ data, fetching }] = useQuery({
    query: GetArchivedSectionsQuery,
    variables: { projectId },
  });
  const sections = data?.me?.project?.sections;
  const [updateSectionStatus, updateSection] = useMutation(
    UpdateSectionMutation
  );

  const unarchive = (id: number) => {
    updateSection({ id, archived: false })
      .then(() => {
        toast.success("Section unarchived!");
      })
      .catch(() => {
        toast.error("There was a problem unarchiving that section!");
      });
  };

  return (
    <>
      {fetching ? (
        <ArchivedSkeleton />
      ) : sections && sections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections
            ?.filter((it) => it.archived)
            .map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => unarchive(parseInt(section.id))}
                  >
                    <MdUnarchive /> Unarchive
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className="my-auto flex flex-col items-center justify-center gap-4 px-4">
          <div className="rounded-full bg-primary-100 p-6 dark:bg-primary-950">
            <MdChecklist size={36} />
          </div>
          <p className="max-w-sm text-center [text-wrap:balance]">
            <strong>You don&apos;t have any archived sections.</strong> Click
            the &quot;Archive Section&quot; button in a section&apos;s dropdown
            menu to archive it.
          </p>
        </div>
      )}
    </>
  );
}

const ArchivedSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {new Array(5).fill(null).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Skeleton className="h-6 w-24" />
        </CardContent>
        <CardFooter>
          <Button variant="secondary" disabled className="w-full">
            <MdUnarchive /> Unarchive
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);
