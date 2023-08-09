import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseURL() {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  }
}
