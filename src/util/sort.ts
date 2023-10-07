import { Task } from "@/gql/graphql";

export function sortByDueDate<T extends Pick<Task, "dueDate" | "createdAt">>(
  tasks: T[]
): T[] {
  const tasksWithDueDate = tasks.filter((task) => task.dueDate !== null);
  const tasksWithoutDueDate = tasks.filter((task) => task.dueDate === null);

  return [
    ...tasksWithDueDate.sort(
      (a, b) => a.dueDate!.getTime() - b.dueDate!.getTime()
    ),
    ...tasksWithoutDueDate.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    ),
  ];
}
