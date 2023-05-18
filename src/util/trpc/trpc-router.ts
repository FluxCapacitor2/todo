import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import { notificationRouter } from "./router/notification";
import { projectsRouter } from "./router/project";
import { sectionsRouter } from "./router/sections";
import { tasksRouter } from "./router/tasks";
import { userRouter } from "./router/user";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export type MyTrpc = typeof t;

export const appRouter = t.router({
  projects: projectsRouter(t),
  sections: sectionsRouter(t),
  tasks: tasksRouter(t),
  user: userRouter(t),
  notification: notificationRouter(t),
});

export type AppRouter = typeof appRouter;
