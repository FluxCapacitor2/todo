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
          !flat &&
            "border border-b-4 border-gray-300 dark:border-gray-700 dark:focus:border-primary-700 focus:border-primary-500",
          "rounded-md dark:bg-gray-900 p-3 h-10 min-w-[12rem] outline-none"
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
          "rounded-md dark:bg-gray-900 p-3 h-10 min-w-[12rem] border border-b-4 border-gray-300 dark:border-gray-700 dark:focus:border-primary-700 outline-none focus:border-primary-500"
        )}
        {...rest}
      />
    );
  }
);

TextArea.displayName = "TextArea";
