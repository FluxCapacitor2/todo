import { clsx, type ClassValue } from "clsx";
import {
  differenceInDays,
  endOfTomorrow,
  endOfYesterday,
  format,
  isAfter,
  isBefore,
  isEqual,
  isToday,
  parseISO,
  set,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns";
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

export function combineDateAndTime(date: Date | null, timeInSeconds: number) {
  if (!date) return null;
  return set(date, {
    hours: Math.floor(timeInSeconds / 3600),
    minutes: Math.floor((timeInSeconds / 60) % 60),
    seconds: 0,
    milliseconds: 0,
  });
}

export function formatTimeInSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds / 60) % 60)
    .toString()
    .padStart(2, "0");
  return format(parseISO(`1970-01-01T${hours}:${minutes}:00`), "hh:mm a");
}

export function extractTimeFromDate(date: Date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

export function shortDateFormat(date: Date) {
  const now = new Date();

  const isThisYear = now.getFullYear() === date.getFullYear();

  const dayDifference = differenceInDays(date, now);

  const isWithinOneWeek = dayDifference > 0 && dayDifference < 7;
  const isTomorrow = isBetween(date, startOfTomorrow(), endOfTomorrow());
  const isYesterday = isBetween(date, startOfYesterday(), endOfYesterday());
  const isLastWeek = dayDifference > -7 && dayDifference < 0;

  const isMidnight =
    date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;

  const day = isYesterday
    ? "Yesterday"
    : isToday(date)
    ? isMidnight
      ? "Today"
      : ""
    : isTomorrow
    ? "Tomorrow"
    : isLastWeek
    ? "Last " + format(date, "EEE")
    : format(date, isWithinOneWeek ? "EEE" : "MMM d");

  const time = isThisYear && !isMidnight ? format(date, "h:m a ") : "";

  const year = !isThisYear ? format(date, "yyyy") : "";

  return `${day}${day && time ? ", " : ""}${time}${year ? ", " : ""}${year}`;
}

export function isBetween(dateToCompare: Date, start: Date, end: Date) {
  return (
    isAfterOrEqual(dateToCompare, start) && isBeforeOrEqual(dateToCompare, end)
  );
}

export function isBeforeOrEqual(date: Date, dateToCompare: Date) {
  return isEqual(date, dateToCompare) || isBefore(date, dateToCompare);
}

export function isAfterOrEqual(date: Date, dateToCompare: Date) {
  return isEqual(date, dateToCompare) || isAfter(date, dateToCompare);
}
