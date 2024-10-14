import { randomUUID } from "crypto"
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

export const handleDownload = (url: string, filename?: string) => {
  const link = document.createElement("a")
  link.href = url
  link.download = filename || "download"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const createRandomFileName = () => {
  const uuid = randomUUID()
  return uuid.slice(0, 8)
}
