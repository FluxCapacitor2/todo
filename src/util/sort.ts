import { Task } from "@prisma/client";

export function sortByDueDate(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate || !b.dueDate) {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    return a.dueDate?.getTime() - b.dueDate?.getTime();
  });
}
