import clsx from "clsx";
import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

export const TextField = forwardRef(
  (
    {
      className,
      flat,
      ...rest
    }: InputHTMLAttributes<HTMLInputElement> & { flat?: boolean },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        type="text"
        ref={ref}
        className={clsx(
          className,
          flat
            ? "border-none bg-transparent focus:ring-0"
            : "border border-b-4 border-gray-300 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-primary-700",
          "h-10 rounded-md p-3 outline-none"
        )}
        {...rest}
      />
    );
  }
);

TextField.displayName = "TextField";

export const TextArea = forwardRef(
  (
    { className, ...rest }: InputHTMLAttributes<HTMLTextAreaElement>,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          className,
          "h-10 min-w-[12rem] rounded-md border border-b-4 border-gray-300 p-3 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-primary-700"
        )}
        {...rest}
      />
    );
  }
);

TextArea.displayName = "TextArea";
