import Link from "next/link";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { MdStarBorder } from "react-icons/md";
import logo from "../../../public/icon.png";

export const TopNav = async () => {
  const session = await getServerSession(authOptions);
  const res = await fetch("https://api.github.com/repos/FluxCapacitor2/todo", {
    next: {
      revalidate: 3600,
    },
  });

  const stars = (await res.json())?.stargazers_count;

  return (
    <nav className="sticky top-0 z-50 flex w-full justify-around bg-white/50 p-4 shadow-sm backdrop-blur-xl dark:border-b dark:border-b-gray-800 dark:bg-black/50">
      <Link href="/" className="flex gap-2">
        <Image src={logo} alt="App logo" className="h-6 w-6" />
        <p className="hidden font-bold sm:inline">Todo App</p>
      </Link>
      <div className="flex items-center gap-8 font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        {session?.user ? (
          <Link href="/projects">Launch</Link>
        ) : (
          <Link href="/signin">Sign In</Link>
        )}
      </div>
      {stars !== undefined && (
        <Link
          href="https://github.com/FluxCapacitor2/todo"
          className="hidden items-center gap-2 md:flex"
        >
          Star on GitHub{" "}
          <span className="flex items-center gap-2 text-gray-500">
            <MdStarBorder />
            {stars}
          </span>
        </Link>
      )}
    </nav>
  );
};
