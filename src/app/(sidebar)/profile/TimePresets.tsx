"use client";

import { GetTimePresetsQuery } from "@/components/ui/DatePickerPopover";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { graphql } from "@/gql";
import { TimePreset } from "@/gql/graphql";
import { formatTimeInSeconds } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery } from "urql";

const AddTimePresetMutation = graphql(`
  mutation addTimePreset($time: Int!) {
    addTimePreset(time: $time) {
      id
      time
    }
  }
`);

const RemoveTimePresetMutation = graphql(`
  mutation removeTimePreset($id: Int!) {
    removeTimePreset(id: $id) {
      id
      time
    }
  }
`);

export const TimePresets = () => {
  const [presets, setPresets] = useState<TimePreset[]>([]);

  const [{ data, fetching, error }] = useQuery({ query: GetTimePresetsQuery });
  const timePresets = data?.me?.timePresets;

  useEffect(() => {
    if (timePresets) setPresets(timePresets);
  }, [timePresets]);

  const [{ fetching: isAdding }, addTimePreset] = useMutation(
    AddTimePresetMutation
  );
  const [{ fetching: isRemoving }, removeTimePreset] = useMutation(
    RemoveTimePresetMutation
  );

  const isMutating = isAdding || isRemoving;

  const timeRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {error !== undefined ? (
        <p className="text-destructive-foreground">
          Failed to load time presets. Please try again later.
        </p>
      ) : fetching ? (
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
                    const result = await removeTimePreset({
                      id: parseInt(preset.id),
                    });
                    setPresets(result.data?.removeTimePreset ?? []);
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
              if (
                presets.some(
                  (it) => it.time === timeRef.current!.valueAsNumber / 1000
                )
              ) {
                toast.error(
                  `You already have a time preset for ${
                    timeRef.current!.value
                  }!`
                );
                return;
              }

              const result = await addTimePreset({
                time: Math.floor(timeRef.current!.valueAsNumber / 1000),
              });
              setPresets(result.data?.addTimePreset ?? []);

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
