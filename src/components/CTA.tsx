import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/Button";

export const CTA = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex gap-2">
      {session?.user ? (
        <>
          <Link href="/projects">
            <Button variant="primary">Launch</Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/signin">
            <Button variant="primary">Sign Up</Button>
          </Link>
        </>
      )}
      <Link href="https://github.com/FluxCapacitor2/todo">
        <Button variant="subtle">
          <FaGithub /> View Source on GitHub
        </Button>
      </Link>
    </div>
  );
};
