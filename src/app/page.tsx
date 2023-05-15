import { Button } from "@/components/ui/Button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import colorThemes from "@/../public/images/color_themes.png";
import projectsDark from "@/../public/images/projects_dark.png";
import projectsLight from "@/../public/images/projects_light.png";
import pwaDark from "@/../public/images/pwa_dark.png";
import pwaLight from "@/../public/images/pwa_light.png";
import subTasks from "@/../public/images/sub_tasks.png";

export default async function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 p-6">
      <h1 className="text-center text-6xl font-black">Todo App</h1>
      <div className="mx-auto max-w-2xl">
        <p>
          A simple todo app built with Next.js, Prisma, tRPC, and TailwindCSS.{" "}
        </p>
      </div>
      {/* @ts-expect-error RSC */}
      <CTA />

      <div className="prose flex max-w-full flex-col gap-6 dark:prose-invert md:flex-row">
        <div className="max-w-prose">
          <h2>Projects</h2>
          <p>
            Projects are the way tasks are organized. Each project can have
            multiple sections, which each contain tasks.
          </p>
        </div>
        <div>
          <Image
            src={projectsLight}
            alt="A view divided into three columns: home, work, and school. Each column has tasks related to the category."
            className="block rounded-md shadow-2xl transition-transform duration-1000 dark:hidden md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125"
          />
          <Image
            src={projectsDark}
            alt="A view divided into three columns: home, work, and school. Each column has tasks related to the category."
            className="hidden rounded-md shadow-2xl transition-transform duration-1000 dark:block md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125"
          />
        </div>
      </div>
      <div className="prose flex max-w-full flex-col-reverse gap-6 dark:prose-invert md:flex-row">
        <div className="aspect-square max-h-96 rounded-md drop-shadow-2xl transition-transform duration-1000 md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125">
          <Image
            src={subTasks}
            alt="A modal showing a task with a due date and five sub-tasks, two of which are completed."
            className="max-h-full max-w-full rounded-md object-scale-down"
          />
        </div>
        <div className="max-w-prose">
          <h2>Sub-tasks</h2>
          <p>
            Each task can have its own infinitely nested sub-tasks, giving you
            fine-grained control over your organization.
          </p>
        </div>
      </div>
      <div className="prose flex max-w-full flex-col gap-6 dark:prose-invert md:flex-row">
        <div className="max-w-prose">
          <h2>Light and Dark Modes</h2>
          <p>Two themes which automatically adjust based on your system.</p>
        </div>
        <div>
          <Image
            src={colorThemes}
            alt="The Project View with an angular split showing both the light and dark themes"
            className="rounded-md shadow-2xl transition-transform duration-1000 md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125"
          />
        </div>
      </div>

      <div className="prose flex max-w-full flex-col-reverse gap-6 dark:prose-invert md:flex-row">
        <div className="max-w-sm">
          <Image
            src={pwaLight}
            alt="The PWA Logo: a wordmark with the letters 'PWA' emphasizing the 'W' for 'Web'."
            className="block drop-shadow-2xl transition-transform duration-1000 dark:hidden md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125"
          />
          <Image
            src={pwaDark}
            alt="The PWA Logo: a wordmark with the letters 'PWA' emphasizing the 'W' for 'Web'."
            className="hidden drop-shadow-2xl transition-transform duration-1000 dark:block md:hover:-translate-y-2 motion-safe:md:hover:scale-110 motion-safe:lg:hover:scale-125"
          />
        </div>
        <div className="max-w-prose">
          <h2>⚡ PWA</h2>
          <p>
            This app runs as a{" "}
            <Link href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">
              progressive web app
            </Link>
            , meaning you can add it to your home screen and receive
            notifications just like a native app with no downloads and instant
            updates.
          </p>
        </div>
      </div>
      <div className="prose flex max-w-full flex-col dark:prose-invert md:flex-row">
        <div className="max-w-prose">
          <h2>Open-Source</h2>
          <p>
            The code for this project is hosted on{" "}
            <Link href="https://github.com/FluxCapacitor2/todo">GitHub</Link>.
            Feature requests and contributions are welcome!
          </p>
        </div>
        <Link href="https://github.com/FluxCapacitor2/todo">
          <FaGithub size={96} className="w-96" />
        </Link>
      </div>
      <hr className="my-6 w-full max-w-prose border-gray-500" />
      {/* @ts-expect-error RSC */}
      <CTA />
    </main>
  );
}

const CTA = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex gap-2">
      {session?.user ? (
        <>
          <Link href="/projects">
            <Button variant="primary">Launch</Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/signin">
            <Button variant="primary">Sign Up</Button>
          </Link>
        </>
      )}
      <Link href="https://github.com/FluxCapacitor2/todo">
        <Button variant="subtle">
          <FaGithub /> View Source on GitHub
        </Button>
      </Link>
    </div>
  );
};
