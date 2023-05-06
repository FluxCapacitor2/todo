import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ProjectPage } from "./ProjectPage";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
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

  return <ProjectPage project={project} />;
}
