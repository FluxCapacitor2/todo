import { PopoverPanel } from "@/components/ui/CustomPopover";
import { DatePicker } from "@/components/ui/DatePicker";
import { Popover } from "@headlessui/react";
import { PropsWithChildren } from "react";

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
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <div className="flex items-center gap-2">
            <Popover.Button
              as="div"
              className="w-full cursor-pointer hover:underline"
            >
              {children}
            </Popover.Button>
          </div>
          <PopoverPanel>
            <DatePicker
              close={close}
              confirm={(newDate) => {
                close();
                setDate(newDate);
              }}
              {...rest}
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};
