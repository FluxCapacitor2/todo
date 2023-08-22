import { Task } from "@prisma/client";

export function sortByDueDate<T extends Task[]>(tasks: T) {
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
