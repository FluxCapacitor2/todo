import { Prisma, PrismaClient } from "@prisma/client";
import chalk from "chalk";

export const prisma = new PrismaClient({
  log: process.env.LOG_QUERIES
    ? [
        {
          emit: "event",
          level: "query",
        },
      ]
    : ["info"],
});

prisma.$on("query", (e) => {
  try {
    log(e);
  } catch (ex) {
    console.error(ex);
    console.log(e.query, e.duration, e.params);
  }
});

const log = (e: Prisma.QueryEvent) => {
  // Budget 'syntax highlighting' to make terminal messages look nicer
  let field = 0;
  const params = JSON.parse(e.params.replaceAll(/\n/g, "\\n"));
  const formatted = e.query
    .replaceAll(/\b(SELECT|WHERE|LIMIT|OFFSET|FROM|AND|OR|IN)\b/g, (word) =>
      chalk.blue(word)
    )
    .replaceAll(/BEGIN|COMMIT|UPDATE|INSERT|INTO|DELETE/g, (word) =>
      chalk.magenta(word)
    )
    .replaceAll(/(`([\w]+)`.){1,}/g, (_, match) => chalk.green(match))
    .replaceAll("?", chalk.cyan("?"))
    .replaceAll(/[,\(\)]/g, (char) => chalk.gray(char))
    .replaceAll(
      /\?/g,
      () => chalk.gray("`") + chalk.cyan(params[field++]) + chalk.gray("`")
    )
    .replaceAll(/1=1|ROLLBACK/g, chalk.red("1=1"));

  console.log(chalk.bgBlueBright(e.duration + "ms"), formatted);
};
