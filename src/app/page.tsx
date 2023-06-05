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

import colorThemes from "@/../public/images/color_themes.png";
import projectsDark from "@/../public/images/projects_dark.png";
import projectsLight from "@/../public/images/projects_light.png";
import subTasks from "@/../public/images/sub_tasks.png";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <TopNav />
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 p-6">
        <h1 className={`text-center text-6xl font-black`}>Todo App</h1>
        <div className="prose mx-auto max-w-2xl dark:prose-invert">
          <p>
            A simple todo app built with Next.js, Prisma, tRPC, and TailwindCSS.{" "}
          </p>
        </div>

        <section className="prose grid max-w-5xl grid-cols-1 gap-4 text-center dark:prose-invert sm:grid-cols-2 md:grid-cols-3 md:text-left">
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdNotificationsActive className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Reminders</h3>
            <p>
              Never miss a due date again. Set and receive reminders for any
              task.
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <BsFillLightningChargeFill className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Caching</h3>
            <p>
              Blazingly fast loading times with caching and{" "}
              <abbr title="Optimistically updating the user interface before updates have fully completed, giving the impression of an instant loading time.">
                optimistic updates
              </abbr>
              .
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdCategory className="h-8 w-8 fill-primary-900 stroke-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Organization</h3>
            <p>
              Group tasks into sections and projects, and add labels
              <sup>(soon)</sup> for easy searching.
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <TbSubtask className="h-8 w-8 fill-primary-900 stroke-primary-900 dark:fill-primary-500 dark:stroke-primary-500" />
            </div>
            <h3 className="text-center">Sub-Tasks</h3>
            <p>Nest sub-tasks infinitely for ultimate organization.</p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdCalendarMonth className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Calendar</h3>
            <p>
              Visualize and plan in advance by viewing your tasks as a calendar.
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdLightMode className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Themes</h3>
            <p>
              Uses your system&apos;s theme. More readable during the day, and
              won&apos;t blind you at night.
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <SiGithub className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">Open-Source</h3>
            <p>
              Read the{" "}
              <Link href="https://github.com/FluxCapacitor2/todo">
                source code
              </Link>
              , contribute, or even run your own instance.
            </p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdFolderShared className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">
              Sharing
              <span className="ml-2 inline-block w-max self-center rounded-full bg-primary-200 px-2 py-1 text-xs text-primary-950">
                NEW
              </span>
            </h3>

            <p>Share your projects with others to keep everyone in the loop.</p>
          </div>
          <div className="flex flex-col rounded-lg p-4">
            <div className="w-max self-center rounded-full bg-primary-100 p-4 dark:bg-primary-100/20">
              <MdWidgets className="h-8 w-8 fill-primary-900 dark:fill-primary-500" />
            </div>
            <h3 className="text-center">
              Widgets
              <span className="ml-2 inline-block w-max self-center rounded-full bg-primary-200 px-2 py-1 text-xs text-primary-950">
                Coming Soon
              </span>
            </h3>

            <p>
              Add a portion of your todo list to your home screen to stay
              productive.
            </p>
          </div>
        </section>

        <section className="prose max-w-full dark:prose-invert">
          <h2>Screenshots</h2>
          <div className="not-prose grid items-center gap-4 md:grid-cols-2 [&>*]:max-h-96 [&>*]:w-auto">
            <div>
              <Image
                src={colorThemes}
                alt="The Project View with an angular split showing both the light and dark themes"
              />
            </div>
            <Image
              src={projectsLight}
              alt="A view divided into three columns: home, work, and school. Each column has tasks related to the category."
              className="block dark:hidden"
            />
            <Image
              src={projectsDark}
              alt="A view divided into three columns: home, work, and school. Each column has tasks related to the category."
              className="hidden dark:block"
            />
            <div className="h-full max-h-96 w-full">
              <Image
                src={subTasks}
                alt="A modal showing a task with a due date and five sub-tasks, two of which are completed."
                className="max-h-96 object-scale-down"
              />
            </div>
          </div>
        </section>

        <CTA />
      </main>
    </>
  );
}
