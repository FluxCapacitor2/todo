import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Action =
  | { className?: string; href: string }
  | ButtonHTMLAttributes<HTMLButtonElement>;

export const PillButton = ({
  children,
  active,
  compact,
  ...props
}: {
  children: ReactNode;
  compact?: boolean;
  active?: boolean;
} & Action) => {
  const className = clsx(
    props.className,
    compact ? "px-3 py-1" : "px-4 py-2",
    "inline-flex items-center justify-center transition-colors first:rounded-l-full last:rounded-r-full",
    active
      ? "bg-primary-300 dark:bg-primary-800"
      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
  );

  if ("href" in props) {
    return (
      <Link href={props.href} className={className}>
        <button>{children}</button>
      </Link>
    );
  } else {
    return (
      <button {...props} className={className}>
        {children}
      </button>
    );
  }
};
