import Link from "next/link";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { MdStarBorder } from "react-icons/md";
import logo from "../../../public/icon.png";
import { ModeToggle } from "./ModeToggle";

export const TopNav = async () => {
  const session = await getServerSession(authOptions);
  const res = await fetch("https://api.github.com/repos/FluxCapacitor2/todo", {
    next: {
      revalidate: 3600,
    },
  });

  const stars = (await res.json())?.stargazers_count;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/50 p-4 shadow-sm backdrop-blur-xl dark:border-b dark:bg-black/50">
      <div className="container flex justify-around">
        <div className="flex flex-1 items-center justify-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="App logo" className="h-6 w-6" />
            <p className="hidden font-bold sm:inline">Todo App</p>
          </Link>
          {stars !== undefined && (
            <Link
              href="https://github.com/FluxCapacitor2/todo"
              className="hidden items-center gap-2 md:flex"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <MdStarBorder />
                {stars}
              </span>
            </Link>
          )}
        </div>
        <div className="flex flex-1 items-center justify-center gap-8 whitespace-nowrap font-medium">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          {session?.user ? (
            <Link href="/projects">Launch</Link>
          ) : (
            <Link href="/signin">Sign In</Link>
          )}
        </div>
        <div className="hidden flex-1 justify-end md:flex">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
