import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";

export const CTA = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex gap-2">
      {session?.user ? (
        <>
          <Link href="/projects">
            <Button>Launch</Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/signin">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
      <Link href="https://github.com/FluxCapacitor2/todo">
        <Button variant="secondary" className="gap-2">
          <FaGithub /> View Source on GitHub
        </Button>
      </Link>
    </div>
  );
};
