import { trpc } from "@/util/trpc/trpc";
import { produce } from "immer";
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
              createdAt: new Date(),
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

export const useUpdateSection = (projectId: string) => {
  const utils = trpc.useContext();
  const { mutateAsync: updateSection } = trpc.sections.update.useMutation({
    onMutate: ({ id, archived }) => {
      utils.projects.get.cancel(projectId);
      if (archived !== undefined) {
        utils.sections.getArchived.cancel(projectId);
      }
      const originalData = utils.projects.get
        .getData(projectId)
        ?.sections?.find((section) => section.id === id);

      utils.projects.get.setData(projectId, (project) => {
        return produce(project, (project) => {
          project?.sections.forEach((section) => {
            if (section.id === id) {
              section.archived = archived === true;
            }
          });
        });
      });
      utils.sections.getArchived.setData(projectId, (sections) => {
        return produce(sections, (sections) => {
          if (archived === true && originalData) {
            sections?.push({
              id,
              archived,
              name: originalData!.name,
              _count: { tasks: 0 },
              projectId,
              createdAt: new Date(),
            });
          } else if (archived === false) {
            sections = sections?.filter((section) => section.id !== id);
          }
        });
      });

      return { originalData };
    },
    onError: (error, { id, archived }, context) => {
      if (!context) return;
      utils.projects.get.setData(projectId, (project) => {
        return produce(project, (project) => {
          project?.sections.forEach((section) => {
            if (section.id === id) {
              section.archived = context.originalData?.archived === true;
              if (context.originalData?.name) {
                section.name = context.originalData?.name;
              }
            }
          });
        });
      });

      utils.sections.getArchived.setData(projectId, (sections) => {
        return produce(sections, (sections) => {
          if (archived === true) {
            sections = sections?.filter((section) => section.id !== id);
          } else if (archived === false && context.originalData?.name) {
            sections?.push({
              id,
              archived,
              name: context.originalData!.name,
              _count: { tasks: 0 },
              projectId,
              createdAt: new Date(),
            });
          }
        });
      });
    },
    onSettled: () => {
      utils.projects.get.invalidate(projectId);
      utils.sections.getArchived.invalidate(projectId);
    },
  });

  return { updateSection };
};

export const useDeleteSection = (projectId: string) => {
  const utils = trpc.useContext();

  const { mutateAsync: deleteSection, isLoading } =
    trpc.sections.delete.useMutation({
      onMutate: ({ id }) => {
        const project = utils.projects.get.getData(projectId);
        const index = project?.sections.findIndex(
          (section) => section.id === id
        );
        if (index === -1 || index === undefined) return;
        const prevSection = project?.sections?.[index];

        utils.projects.get.cancel(projectId);
        utils.projects.get.setData(projectId, (project) => {
          if (!project) return undefined;

          const g = {
            ...project,
            sections: project.sections.filter((section) => section.id !== id),
          };
          return g;
        });

        return { prevSection, index };
      },
      onError: (error, { id }, context) => {
        if (!context) return;
        toast.error("There was an error deleting that section!");
        utils.projects.get.setData(projectId, (project) => {
          if (!project) return undefined;
          return produce(project, (project) => {
            project.sections.splice(context.index!, 0, context.prevSection!);
          });
        });
      },
      onSettled: () => {
        utils.projects.get.invalidate(projectId);
      },
    });

  return { deleteSection, isLoading };
};
