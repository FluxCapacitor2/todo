import { prisma } from "@/util/prisma";
import { EventAttributes, createEvents } from "ics";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300; // 5 minutes

export const GET = async (
  _req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // Sorry if you have to debug this
  const tasks = await prisma.task.findMany({
    where: {
      completed: false,
      dueDate: {
        not: null,
      },
      project: {
        OR: [
          {
            owner: {
              apiTokens: {
                some: {
                  id,
                },
              },
            },
          },
          {
            collaborators: {
              some: {
                user: {
                  apiTokens: {
                    some: {
                      id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  });

  const events = tasks.map((task) => {
    const date = task.dueDate!;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/project/${task.projectId}/${task.id}`;
    return {
      title: task.name,
      description: task.description + `\n\nEdit task: ${url}`,
      url: url,
      duration: { hours: 1 },
      start: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ],
    } as EventAttributes;
  });

  const { value: result, error } = createEvents(events);

  if (error) {
    return NextResponse.json("Error creating calendar", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response(result, {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
};
