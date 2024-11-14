import "@testing-library/jest-dom/vitest"

import { loadEnvConfig } from "@next/env"
import { vi } from "vitest"

// load .env.test.local
loadEnvConfig(process.cwd())

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))
