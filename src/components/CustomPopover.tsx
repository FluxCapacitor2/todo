import { Transition, Popover } from "@headlessui/react";
import clsx from "clsx";
import {
  Fragment,
  HTMLProps,
  PropsWithChildren,
  ReactNode,
  forwardRef,
} from "react";

type PopoverProps =
  | HTMLProps<HTMLDivElement>
  | {
      children:
        | ReactNode
        | (({
            open,
            close,
          }: {
            open: boolean;
            close: () => void;
          }) => ReactNode);
    };

const WrapperDiv = forwardRef<
  HTMLDivElement,
  PropsWithChildren<HTMLProps<HTMLDivElement>>
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      className={clsx(
        props.className,
        "overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-950 p-4"
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

WrapperDiv.displayName = "WrapperDiv";

export const PopoverPanel = forwardRef<HTMLDivElement, PopoverProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    return (
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {typeof props.children === "function" ? (
          <Popover.Panel className="absolute bottom-10 z-10">
            {({ open, close }) => (
              <WrapperDiv {...rest} ref={ref}>
                {/* @ts-ignore */}
                {props.children({ open, close })}
              </WrapperDiv>
            )}
          </Popover.Panel>
        ) : (
          <Popover.Panel className="absolute z-10">
            <WrapperDiv {...rest} ref={ref}>
              {/* @ts-ignore */}
              {children}
            </WrapperDiv>
          </Popover.Panel>
        )}
      </Transition>
    );
  }
);

PopoverPanel.displayName = "PopoverPanel";
