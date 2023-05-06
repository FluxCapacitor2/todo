import { authOptions, ExtSession } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ReactNode } from "react";

export async function getProject(id: string) {
  const session = (await getServerSession(authOptions)) as ExtSession;

  if (!session?.user) {
    redirect("/signin");
  }

  const project = await prisma.project.findFirst({
    where: {
      ownerId: session.id,
      id: id,
    },
    include: {
      sections: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }
  return project;
}

export default async function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const project = await getProject(id);

  return (
    <main className="px-6 pt-4">
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <div className="flex">
        <PillButton href={`/project/${id}`}>Project</PillButton>
        <PillButton href={`/project/${id}/list`}>List</PillButton>
        <PillButton href={`/project/${id}/calendar`}>Calendar</PillButton>
      </div>
      {children}
    </main>
  );
}

const PillButton = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="first:rounded-l-full last:rounded-r-full bg-gray-900 hover:bg-gray-800 px-3 py-1"
    >
      <button>{children}</button>
    </Link>
  );
};
