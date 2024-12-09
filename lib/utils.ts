import { randomUUID } from "crypto"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** only server */
export const createDateWithTimezone = (date: Date) => {
  const localDate = new Date(date)

  if (process.env.TZ === "Asia/Tokyo") {
    localDate.setUTCHours(localDate.getUTCHours() + 9)
  }

  return localDate
}

export const formatUTCString = (date: Date) => {
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString().slice(0, 16)
}

export const formatUTCToLocalString = (date: Date) => {
  const options = { timeZone: process.env.TZ, hour12: false }
  const serverFormattedDate = date.toLocaleString(
    process.env.TZ === "Asia/Tokyo" ? "ja-JP" : undefined,
    options
  )

  return serverFormattedDate
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
