import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toLocalISOString = (date: Date) => {
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString().slice(0, -1)
}

export const createDateWithTimezone = (date: Date) => {
  const localDate = new Date(date)

  if (process.env.TZ === "Asia/Tokyo") {
    localDate.setUTCHours(localDate.getUTCHours() + 9)
  }

  return localDate
}
