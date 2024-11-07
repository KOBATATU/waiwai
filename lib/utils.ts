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

export const editDateWithTimezone = (localDate: Date) => {
  const formatNumber = (num: number) => String(num).padStart(2, "0")
  const { year, month, day, hours, minutes } = {
    year: localDate.getFullYear(),
    month: formatNumber(localDate.getUTCMonth() + 1),
    day: formatNumber(localDate.getUTCDate()),
    hours: formatNumber(localDate.getHours()),
    minutes: formatNumber(localDate.getUTCMinutes()),
  }

  return `${year}/${month}/${day}T${hours}:${minutes}`
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

/**
 * get query parameter
 */
export type GetQueryParameter = {
  searchParams: { [key: string]: string | string[] | undefined }
}
export const getQueryParameter = ({ searchParams }: GetQueryParameter) => {
  let page: string | number =
    typeof searchParams.page === "string" ? searchParams.page : "1"
  page = parseInt(page) ? parseInt(page) : 1
  return {
    page,
  }
}
export type QueryParameters = ReturnType<typeof getQueryParameter>
