import { ExtSession, authOptions } from "@/pages/api/auth/[...nextauth]";
import { TRPCError, inferAsyncReturnType } from "@trpc/server";
import { getServerSession } from "next-auth";

export async function createContext() {
  const session = (await getServerSession(authOptions)) as ExtSession;
  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return {
    session,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
