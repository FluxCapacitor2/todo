import { PopoverPanel } from "@/components/CustomPopover";
import { DatePicker } from "@/components/DatePicker";
import { Popover } from "@headlessui/react";
import { PropsWithChildren } from "react";

export const DatePickerPopover = ({
  children,
  date,
  setDate,
  allow = () => true,
}: PropsWithChildren<{
  date: Date | null;
  setDate: (date: Date) => void;
  allow?: (date: Date) => boolean;
}>) => {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <div className="flex gap-2 items-center">
            <Popover.Button
              as="div"
              className="w-full hover:underline cursor-pointer"
            >
              {children}
            </Popover.Button>
          </div>
          <PopoverPanel>
            <DatePicker
              allow={allow}
              date={date ?? undefined}
              close={close}
              confirm={(newDate) => {
                close();
                setDate(newDate);
              }}
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};
