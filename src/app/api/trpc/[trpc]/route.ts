import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/util/trpc/trpc-router";
import { createContext } from "@/util/trpc/context";
import chalk from "chalk";

const handler = (request: Request) => {
  console.log(`${chalk.bgRed(request.method)} ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST };
