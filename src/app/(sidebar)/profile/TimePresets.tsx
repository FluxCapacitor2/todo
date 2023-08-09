"use client";

import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatTimeInSeconds } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { TimePreset } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";

export const TimePresets = () => {
  const [presets, setPresets] = useState<TimePreset[]>([]);

  const {
    data: timePresets,
    isLoading,
    isError,
  } = trpc.user.getTimePresets.useQuery();

  useEffect(() => {
    if (timePresets) setPresets(timePresets);
  }, [timePresets]);

  const { mutateAsync: addTimePreset, isLoading: isAdding } =
    trpc.user.addTimePreset.useMutation();
  const { mutateAsync: removeTimePreset, isLoading: isRemoving } =
    trpc.user.removeTimePreset.useMutation();

  const isMutating = isAdding || isRemoving;

  const timeRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {isError ? (
        <p className="text-destructive-foreground">
          Failed to load time presets. Please try again later.
        </p>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <>
          {presets.map((preset) => (
            <Card className="mb-2" key={preset.id}>
              <CardContent className="flex items-center justify-between p-1">
                <span className="pl-1">{formatTimeInSeconds(preset.time)}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isMutating}
                  onClick={async () => {
                    setPresets(await removeTimePreset(preset.id));
                  }}
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (isNaN(timeRef.current!.valueAsNumber)) {
                toast.error("Invalid time value!");
                return;
              }
              setPresets(
                await addTimePreset(
                  Math.floor(timeRef.current!.valueAsNumber / 1000)
                )
              );
              timeRef.current!.valueAsNumber = NaN;
            }}
          >
            <Input type="time" name="time" ref={timeRef} />
            <Button type="submit" disabled={isMutating}>
              Add
            </Button>
          </form>
        </>
      )}
    </>
  );
};
