"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { HTMLProps, ReactNode, useLayoutEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import githubScreenshot from "../../public/images/github_screenshot.png";

export const HomePage = () => {
  const [activeSection, setActiveSection] = useState("categorize");

  useLayoutEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const handler = () => {
      let activeSection = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top < 300) {
          activeSection = section;
        }
      }
      setActiveSection(activeSection.id);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });

    return () => window.removeEventListener("scroll", handler);
  });

  return (
    <main>
      <div className="mx-auto mb-24 flex max-w-6xl flex-col items-center gap-4">
        <section className="space-y-2 px-6 py-24">
          <h1 className={`text-center text-6xl font-black`}>Todo App</h1>
          <div className="prose mx-auto max-w-2xl dark:prose-invert">
            <p>A todo app built with Next.js, Prisma, tRPC, and TailwindCSS.</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Link href="/signin">
              <Button>Sign Up</Button>
            </Link>
            <Link href="https://github.com/FluxCapacitor2/todo">
              <Button variant="secondary" className="gap-2">
                <FaGithub /> View Source on GitHub
              </Button>
            </Link>
          </div>
        </section>

        <div className="mt-24 flex justify-between px-2 md:px-6 lg:gap-8">
          <div className="relative">
            <aside className="sticky top-24 hidden w-56 flex-col gap-2 lg:flex">
              <NavLink href="#categorize" active={activeSection}>
                Categorize
              </NavLink>
              <NavLink href="#reminders" active={activeSection}>
                Get Reminders
              </NavLink>
              <NavLink href="#start-and-due-dates" active={activeSection}>
                Start and Due Dates
              </NavLink>
              <NavLink href="#dark-mode" active={activeSection}>
                Dark Mode
              </NavLink>
              <NavLink href="#nested-sub-tasks" active={activeSection}>
                Nestable Sub-Tasks
              </NavLink>
              <NavLink href="#sharing" active={activeSection}>
                Project Sharing
              </NavLink>
              <NavLink href="#foss" active={activeSection}>
                Free and Open-Source
              </NavLink>
            </aside>
          </div>
          <div className="flex flex-col gap-12 lg:gap-36">
            <section id="categorize">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Categorize</h2>
                <p className="text-muted-foreground">
                  Group tasks into sections and projects, and add labels(soon)
                  for easy searching
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Video src="/videos/categorize.webm" muted autoPlay loop />
                </CardContent>
              </Card>
            </section>

            <section id="reminders">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Get Reminders</h2>
                <p className="text-muted-foreground">
                  Never miss a due date again. Set and receive multiple
                  reminders for any time, for any task.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Video src="/videos/get_reminders.webm" muted autoPlay loop />
                </CardContent>
              </Card>
            </section>

            <section id="start-and-due-dates">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Start and Due Dates</h2>
                <p className="text-muted-foreground">
                  Get an expected progress for your tasks calculated linearly
                  with the current date and the task&apos;s start and due dates.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Video
                    src="/videos/start_and_due_dates.webm"
                    muted
                    autoPlay
                    loop
                  />
                </CardContent>
              </Card>
            </section>

            <section id="dark-mode">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Dark Mode</h2>
                <p className="text-muted-foreground">
                  Uses your system&apos;s theme by default. More readable during
                  the day, and won&apos;t blind you at night.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Video src="/videos/dark_mode.webm" muted autoPlay loop />
                </CardContent>
              </Card>
            </section>

            <section id="nested-sub-tasks">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Nestable Sub-Tasks</h2>
                <p className="text-muted-foreground">
                  Nest sub-tasks infinitely for ultimate organization.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Video
                    src="/videos/nested_sub_tasks.webm"
                    muted
                    autoPlay
                    loop
                  />
                </CardContent>
              </Card>
            </section>

            <section id="sharing">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Project Sharing</h2>
                <p className="text-muted-foreground">
                  Share your projects with others to keep everyone in the loop.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Tabs defaultValue="owner">
                    <TabsList>
                      <TabsTrigger value="owner">Project Owner</TabsTrigger>
                      <TabsTrigger value="collaborator">
                        Collaborator
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="owner">
                      <Video
                        src="/videos/sharing_pt1.webm"
                        muted
                        autoPlay
                        loop
                      />
                    </TabsContent>
                    <TabsContent value="collaborator">
                      <Video
                        src="/videos/sharing_pt2.webm"
                        muted
                        autoPlay
                        loop
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            <section id="foss">
              <div className="mb-6">
                <h2 className="text-4xl font-bold">Free and Open-Source</h2>
                <p className="text-muted-foreground">
                  Are you a developer? Read the{" "}
                  <Link
                    href="https://github.com/FluxCapacitor2/todo"
                    className="font-medium text-secondary-foreground underline"
                  >
                    source code
                  </Link>
                  , contribute, or even run your own instance. If not, you can
                  still use the service for free.
                </p>
              </div>

              <Card>
                <CardContent className="p-0 lg:p-6">
                  <Image
                    src={githubScreenshot}
                    alt="Screenshot of the project's GitHub page"
                    placeholder="blur"
                  />
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
      <div className="relative flex h-96 items-center py-12">
        <div
          className="absolute inset-0 -z-20 hidden bg-primary-100 md:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-[url(/tile.png)] opacity-20 [background-size:10rem] md:block"
          aria-hidden="true"
        />
        <Card className="mx-auto border-none md:border-solid">
          <CardContent className="p-8 px-16">
            <h2 className="mb-4 text-center text-3xl font-bold">
              What are you waiting for?
            </h2>
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Link href="/signin">
                <Button>Sign Up</Button>
              </Link>
              <Link href="https://github.com/FluxCapacitor2/todo/">
                <Button variant="secondary" className="gap-2">
                  <FaGithub />
                  View Source on GitHub
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const Video = (props: HTMLProps<HTMLVideoElement>) => {
  return (
    <Dialog>
      <DialogContent className="max-h-max max-w-6xl overflow-hidden p-0 [&>button]:hidden">
        <video {...props} controls />
      </DialogContent>
      <DialogTrigger>
        <video {...props} />
      </DialogTrigger>
    </Dialog>
  );
};

const NavLink = ({
  children,
  href,
  active,
}: {
  children: ReactNode;
  href: string;
  active: string;
}) => {
  const isActive = "#" + active === href;
  return (
    <Link
      className={cn(
        "flex h-9 items-center gap-2 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-primary text-primary-foreground hover:bg-primary-600/80"
      )}
      href={href}
    >
      <Checkbox
        checked={isActive}
        className={cn(isActive && "border-white !bg-white !text-primary-600")}
      />
      {children}
    </Link>
  );
};
