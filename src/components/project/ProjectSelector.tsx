import { trpc } from "@/util/trpc/trpc";
import { Project } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import { Spinner } from "../ui/Spinner";
import { Checkbox } from "../ui/checkbox";

export const ProjectSelector = ({
  children,
}: {
  children: (
    included: Omit<Project, "archived" | "createdAt">[] | undefined
  ) => ReactNode;
}) => {
  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: 60_000 * 10, // 10 minutes
  });
  const [included, setIncluded] = useState(projects);

  useEffect(() => {
    if (included === undefined) {
      setIncluded(projects);
    }
  }, [projects, included]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {included ? (
          projects?.map((project, i) => (
            <div
              className="inline-flex items-center gap-3 rounded-full bg-gray-100 px-3 py-1 font-medium dark:bg-gray-800"
              key={project.id}
            >
              <Checkbox
                id={`proj-${i}`}
                checked={included.some((it) => it.id === project.id)}
                onCheckedChange={(checked) => {
                  if (checked === true) {
                    setIncluded([...included, project]);
                  } else {
                    setIncluded(included.filter((it) => it.id !== project.id));
                  }
                }}
              />
              <label htmlFor={`proj-${i}`} className="line-clamp-1">
                {project.name}
              </label>
            </div>
          ))
        ) : (
          <Spinner />
        )}
      </div>
      <hr className="my-4 border-b border-t-0 border-gray-500" />
      {children(included)}
    </>
  );
};
