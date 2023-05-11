import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="h-96 w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
