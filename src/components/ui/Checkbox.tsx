import clsx from "clsx";
import {
  DetailedHTMLProps,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
} from "react";

export const Checkbox = forwardRef(
  (
    props: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <>
      <input
        ref={ref}
        type="checkbox"
        {...props}
        className={clsx(
          props.className,
          "h-5 w-5 cursor-pointer rounded-full border-2 text-primary-600 transition-colors hover:bg-primary-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
        )}
      />
    </>
  )
);

Checkbox.displayName = "Checkbox";
