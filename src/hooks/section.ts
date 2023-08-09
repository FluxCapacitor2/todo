import { trpc } from "@/util/trpc/trpc";
import toast from "react-hot-toast";

export const useCreateSection = (projectId: string) => {
  const utils = trpc.useContext();
  const { mutateAsync: createSection } = trpc.sections.create.useMutation({
    onMutate: ({ name, projectId }) => {
      const newId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

      utils.projects.get.cancel(projectId);
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return {
          ...project,
          sections: [
            ...project.sections,
            {
              name,
              id: newId,
              projectId,
              tasks: [],
              archived: false,
            },
          ],
        };
      });
      return { newId };
    },
    onError: (error, variables, context) => {
      toast.error("There was an error creating that section!");
      if (!context) return;
      utils.projects.get.setData(projectId, (project) => {
        if (!project) return undefined;
        return {
          ...project,
          sections: {
            ...project.sections.filter((it) => it.id !== context.newId),
          },
        };
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
    },
  });

  return { createSection };
};
