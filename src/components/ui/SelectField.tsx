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
          "h-10 rounded-md border border-b-4 border-gray-300 px-3 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-primary-700"
        )}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

SelectField.displayName = "SelectField";
