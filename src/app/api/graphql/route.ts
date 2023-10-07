import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createYoga } from "graphql-yoga";
import { getServerSession } from "next-auth";
import { schema } from "./schema";

const handleRequest = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async ({ params, request }) => {
    const user = await getServerSession(authOptions);
    if (user === null) {
      throw new Error("Unauthenticated!");
    }
    return { userId: user.id, user: user.user };
  },
}) as (req: Request) => Promise<Response>;

export { handleRequest as GET, handleRequest as POST };
