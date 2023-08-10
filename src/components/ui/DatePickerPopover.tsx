import {
  combineDateAndTime,
  extractTimeFromDate,
  formatTimeInSeconds,
} from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { PopoverClose } from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { Spinner } from "./Spinner";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export const DatePickerPopover = ({
  date: inDate,
  setDate: confirm,
  children,
}: {
  date: Date | null;
  setDate: (arg0: Date) => void;
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
        <Select
          onValueChange={(value) => setTime(parseInt(value))}
          defaultValue={defaultTime.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick a time..." />
          </SelectTrigger>
          <SelectContent position="popper">
            {!timePresets?.some((it) => it.time === defaultTime) && (
              <SelectItem value={defaultTime.toString()}>
                {formatTimeInSeconds(defaultTime)}
              </SelectItem>
            )}
            {isLoading && (
              <SelectItem disabled value={Math.random().toString()}>
                <Spinner className="inline" /> Loading time presets...
              </SelectItem>
            )}
            {timePresets?.map((preset) => (
              <SelectItem value={preset.time.toString()} key={preset.id}>
                {formatTimeInSeconds(preset.time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-end">
          <PopoverClose asChild>
            <Button
              onClick={() => confirm(combineDateAndTime(date, time)!)}
              disabled={date === null}
            >
              Confirm
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
