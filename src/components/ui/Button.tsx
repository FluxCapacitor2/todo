import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

const styles = {
  primary:
    "text-white bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-900",
  subtle:
    "bg-black/[.08] hover:bg-black/[.15] dark:bg-gray-800 dark:hover:bg-gray-700",
  flat: "hover:bg-gray-100 dark:hover:bg-white/10",
  danger:
    "bg-red-500 dark:bg-red-700 dark:hover:bg-red-800 text-white hover:bg-red-600",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: keyof typeof styles;
  }
>(({ variant, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        props.className,
        styles[variant],
        "rounded-md px-3 py-2 flex justify-center items-center gap-2 font-medium whitespace-nowrap transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
      )}
    />
  );
});

Button.displayName = "Button";
