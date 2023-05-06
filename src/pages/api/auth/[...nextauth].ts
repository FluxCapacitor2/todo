import { prisma } from "@/util/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export interface ExtSession extends Session {
  /**
   * The user's unique ID.
   */
  id: string;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      (session as ExtSession).id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
