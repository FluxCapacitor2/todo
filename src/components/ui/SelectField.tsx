import clsx from "clsx";
import { ForwardedRef, HTMLProps, PropsWithChildren, forwardRef } from "react";

export const SelectField = forwardRef(
  (
    {
      className,
      children,
      ...rest
    }: PropsWithChildren<HTMLProps<HTMLSelectElement>>,
    ref: ForwardedRef<HTMLSelectElement>
  ) => {
    return (
      <select
        ref={ref}
        className={clsx(
          className,
          "rounded-md dark:bg-gray-900 px-3 h-10 min-w-[12rem] border border-b-4 border-gray-300 dark:border-gray-700 dark:focus:border-primary-700 outline-none focus:border-primary-500"
        )}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

SelectField.displayName = "SelectField";
