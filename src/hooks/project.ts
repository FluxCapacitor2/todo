import { trpc } from "@/util/trpc/trpc";

export const useUpdateProject = (id: string) => {
  const utils = trpc.useContext();
  const { mutateAsync: updateProject, isLoading } =
    trpc.projects.update.useMutation({
      onMutate: ({ id, archived, name }) => {
        // TODO optimistic update
      },
      onError: (error, { id, archived, name }) => {
        // TODO optimistic update
      },
      onSettled: () => {
        utils.projects.get.invalidate(id);
        utils.projects.list.invalidate();
      },
    });

  return {
    updateProject: (data: { name?: string; archived?: boolean }) =>
      updateProject({ ...data, id }),
    isMutating: isLoading,
  };
};
