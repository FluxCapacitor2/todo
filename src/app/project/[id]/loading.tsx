import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
