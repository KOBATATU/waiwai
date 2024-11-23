import "@testing-library/jest-dom/vitest"

import { execSync } from "child_process"
import { loadEnvConfig } from "@next/env"
import { Prisma, PrismaClient } from "@prisma/client"
import { beforeEach, vi } from "vitest"

// load .env.test.local
loadEnvConfig(process.cwd())

process.env["DATABASE_URL"] =
  `postgresql://${process.env.DB_TESTUSER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/waiwai?schema=public`

execSync("npx prisma migrate deploy", { stdio: "inherit" })

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
