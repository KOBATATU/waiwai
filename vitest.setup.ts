import "@testing-library/jest-dom/vitest"

import { loadEnvConfig } from "@next/env"
import { vi } from "vitest"

// load .env.test.local
loadEnvConfig(process.cwd())

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))
