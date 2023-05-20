import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

export const PillButton = ({
  children,
  href,
  active,
}: {
  children: ReactNode;
  href: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-1 transition-colors first:rounded-l-full last:rounded-r-full",
        active
          ? "bg-primary-300 dark:bg-primary-800"
          : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
      )}
    >
      <button>{children}</button>
    </Link>
  );
};
