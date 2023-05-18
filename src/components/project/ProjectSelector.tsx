import { trpc } from "@/util/trpc/trpc";
import { Project } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import { Spinner } from "../ui/Spinner";

export const ProjectSelector = ({
  children,
}: {
  children: (included: Project[] | undefined) => ReactNode;
}) => {
  const { data: projects } = trpc.projects.list.useQuery();
  const [included, setIncluded] = useState(projects);

  useEffect(() => {
    if (included === undefined) {
      setIncluded(projects);
    }
  }, [projects, included]);

  return (
    <div className="mb-4">
      {included ? (
        projects?.map((project, i) => (
          <div
            className="mr-4 inline-flex items-center gap-3 rounded-full bg-gray-100 px-3 py-1"
            key={project.id}
          >
            <input
              type="checkbox"
              id={`proj-${i}`}
              checked={included.some((it) => it.id === project.id)}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  setIncluded([...included, project]);
                } else {
                  setIncluded(included.filter((it) => it.id !== project.id));
                }
              }}
            />
            <label htmlFor={`proj-${i}`}>{project.name}</label>
          </div>
        ))
      ) : (
        <Spinner />
      )}
      {children(included)}
    </div>
  );
};
