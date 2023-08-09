import Link from "next/link";

import { CTA } from "@/components/CTA";
import { TopNav } from "@/components/global/TopNav";
import { BsFillLightningChargeFill } from "react-icons/bs";
import {
  MdCalendarMonth,
  MdCategory,
  MdFolderShared,
  MdLightMode,
  MdNotificationsActive,
  MdWidgets,
} from "react-icons/md";
import { SiGithub } from "react-icons/si";
import { TbSubtask } from "react-icons/tb";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegQuestionCircle } from "react-icons/fa";

export default async function Home() {
  return (
    <TooltipProvider>
      <TopNav />
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 p-6">
        <h1 className={`text-center text-6xl font-black`}>Todo App</h1>
        <div className="prose mx-auto max-w-2xl dark:prose-invert">
          <p>
            A simple todo app built with Next.js, Prisma, tRPC, and TailwindCSS.{" "}
          </p>
        </div>

        <CTA />

        <section className="prose grid max-w-5xl grid-cols-1 gap-4 text-center dark:prose-invert sm:grid-cols-2 md:grid-cols-3 md:text-left">
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdNotificationsActive className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Reminders</h3>
              <p>
                Never miss a due date again. Set and receive reminders for any
                task.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <BsFillLightningChargeFill className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Caching</h3>
              <p>
                Blazingly fast loading times with caching and{" "}
                <Tooltip>
                  <TooltipContent className="max-w-sm">
                    Optimistically updating the user interface before updates
                    have fully completed, giving the impression of an instant
                    loading time.
                  </TooltipContent>
                  <TooltipTrigger>
                    optimistic updates.{" "}
                    <FaRegQuestionCircle className="inline" />
                  </TooltipTrigger>
                </Tooltip>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdCategory className="h-8 w-8 fill-primary-900 stroke-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Organization</h3>
              <p>
                Group tasks into sections and projects, and add labels
                <sup>(soon)</sup> for easy searching.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <TbSubtask className="h-8 w-8 fill-primary-900 stroke-primary-900 dark:fill-primary-500 dark:stroke-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Sub-Tasks</h3>
              <p>Nest sub-tasks infinitely for ultimate organization.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdCalendarMonth className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Calendar</h3>
              <p>
                Visualize and plan in advance by viewing your tasks as an iCal
                feed in an external calendar app.{" "}
                <Tooltip>
                  <TooltipContent className="max-w-sm">
                    By copying and pasting a special link into your calendar
                    app, you can view all upcoming tasks with due dates. It
                    works similarly to{" "}
                    <Link href="https://todoist.com/help/articles/use-todoist-with-your-calendar">
                      Todoist&apos;s calendar feature
                    </Link>
                    .
                  </TooltipContent>
                  <TooltipTrigger>
                    <FaRegQuestionCircle className="inline" />
                  </TooltipTrigger>
                </Tooltip>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdLightMode className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Themes</h3>
              <p>
                Uses your system&apos;s theme by default. More readable during
                the day, and won&apos;t blind you at night.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <SiGithub className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Open-Source</h3>
              <p>
                Read the{" "}
                <Link href="https://github.com/FluxCapacitor2/todo">
                  source code
                </Link>
                , contribute, or even run your own instance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdFolderShared className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">Sharing</h3>

              <p>
                Share your projects with others to keep everyone in the loop.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 py-2">
              <div className="mx-auto w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
                <MdWidgets className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
              </div>
              <h3 className="mt-2 text-center">
                Widgets
                <Badge className="ml-1 align-middle">Coming Soon</Badge>
              </h3>

              <p>
                Add a portion of your todo list to your home screen to stay
                productive.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </TooltipProvider>
  );
}
