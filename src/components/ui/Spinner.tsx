import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Spinner = ({ className }: { className: string }) => (
  <Loader2 className={cn("animate-spin", className)} />
);
