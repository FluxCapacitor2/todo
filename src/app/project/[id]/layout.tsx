import { ViewSelector } from "@/components/project/ViewSelector";
import { authOptions, ExtSession } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ReactNode } from "react";

export const generateMetadata = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const meta = await prisma.project.findFirst({
    where: { id },
    select: { name: true },
  });

  if (!meta) {
    notFound();
  }

  return {
    title: meta.name,
  };
};

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
      <h1 className="mb-2 text-2xl font-bold">{project.name}</h1>
      <ViewSelector id={id} />
      {children}
    </main>
  );
}
