import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { TRPCError, inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import { prisma } from "../prisma";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  if (req.headers.has("authorization")) {
    const authorization = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    const user = await prisma.user.findFirst({
      where: {
        apiTokens: {
          some: {
            id: authorization,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return {
      session: {
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
        expires: new Date().toISOString(),
        id: user.id,
      },
    };
  } else {
    const session = (await getServerSession(authOptions)) as ExtSession;
    if (!session || !session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return {
      session,
    };
  }
}
export type Context = inferAsyncReturnType<typeof createContext>;
