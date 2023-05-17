import { DatePicker } from "@/components/ui/DatePicker";
import {
  autoUpdate,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { Portal } from "@headlessui/react";
import { PropsWithChildren, useState } from "react";

type DatePickerPopoverProps = PropsWithChildren<
  Omit<Parameters<typeof DatePicker>[0], "close" | "confirm"> & {
    setDate: (date: Date) => void;
  }
>;

export const DatePickerPopover = ({
  children,
  setDate,
  ...rest
}: DatePickerPopoverProps) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    middleware: [shift()],
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { bubbles: false });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full cursor-pointer hover:underline"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          {children}
        </div>
      </div>
      {open && (
        <Portal>
          <div
            className="overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-950"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <DatePicker
              close={() => setOpen(false)}
              confirm={(newDate) => {
                setOpen(false);
                setDate(newDate);
              }}
              {...rest}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};
