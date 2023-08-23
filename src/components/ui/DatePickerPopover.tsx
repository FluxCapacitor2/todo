import {
  combineDateAndTime,
  extractTimeFromDate,
  formatTimeInSeconds,
} from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { MdAddBox, MdClear, MdClose } from "react-icons/md";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export const DatePickerPopover = ({
  date: inDate,
  setDate: confirm,
  children,
}: {
  date: Date | null;
  setDate: (arg0: Date | null) => void;
  children: ReactNode;
}) => {
  const {
    data: timePresets,
    isLoading,
    isError,
  } = trpc.user.getTimePresets.useQuery();

  const defaultTime = inDate ? extractTimeFromDate(inDate) : 0;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(inDate);
  const [time, setTime] = useState<number>(defaultTime);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="grid min-w-min gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(date) => {
            setDate(date ?? null);
          }}
          initialFocus
        />

        <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {time ? formatTimeInSeconds(time) : "Select a time..."}
              {time !== 0 && (
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    setTime(0);
                    e.stopPropagation();
                  }}
                  size="icon"
                  className="ml-2 h-4 w-4 shrink-0"
                >
                  <MdClose />
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[300px]">
            <p className="text-sm font-medium leading-none">Use a preset</p>
            <div className="my-2 grid grid-cols-2 gap-2">
              {timePresets?.map((preset) => (
                <PopoverClose asChild key={preset.id}>
                  <Button
                    onClick={() => setTime(preset.time)}
                    variant="secondary"
                  >
                    {formatTimeInSeconds(preset.time)}
                  </Button>
                </PopoverClose>
              ))}
              <PopoverClose asChild>
                <Button
                  onClick={() => router.push("/profile")}
                  className="col-span-2 gap-2"
                  variant="outline"
                >
                  <MdAddBox />
                  Add Preset
                </Button>
              </PopoverClose>
            </div>
            <Label>
              Select a custom time
              <div className="flex gap-2">
                <Input
                  type="time"
                  onChange={(e) => {
                    !isNaN(e.currentTarget.valueAsNumber) &&
                      setTime(e.currentTarget.valueAsNumber / 1000);
                  }}
                />
                <PopoverClose asChild>
                  <Button>Save</Button>
                </PopoverClose>
              </div>
            </Label>
          </PopoverContent>
        </Popover>

        <div className="mt-3 flex justify-between gap-2">
          {date !== null && (
            <Button
              onClick={() => setDate(null)}
              variant="secondary"
              className="gap-2"
            >
              <MdClear /> Clear
            </Button>
          )}
          <PopoverClose asChild>
            <Button
              onClick={() => confirm(combineDateAndTime(date, time)!)}
              className="ml-auto"
            >
              Confirm
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
