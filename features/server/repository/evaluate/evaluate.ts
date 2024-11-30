import { cookies } from "next/headers"
import { BadException, ExceptionEnum } from "@/features/server/core/exception"

export type HttpMethod = "POST"

export interface HttpClientOptions {
  method?: HttpMethod
  body?: any
  headers?: Record<string, string>
}

export const httpClient = async <T>(
  path: string,
  options: HttpClientOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers } = options
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("next-auth.session-token")
  const sessionToken = sessionCookie ? sessionCookie.value : ""
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "session-id": sessionToken,
      ...headers,
    },
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const hostUrl = process.env.WAIWAI_EVALUATE_API

    const fullUrl = hostUrl + path
    const response = await fetch(fullUrl, fetchOptions)
    if (!response.ok) {
      throw new BadException("evaluateApiFailed", ["error"])
    }
    return (await response.json()) as T
  } catch (error) {
    throw new BadException("evaluateApiFailed", ["error"])
  }
}

export const post = async <T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<T> => {
  return await httpClient<T>(url, {
    method: "POST",
    body,
    headers: {
      ...headers,
    },
  })
}
