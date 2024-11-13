import "@testing-library/jest-dom/vitest"

import { execSync } from "child_process"
import {
  prismaClient,
  prismaPagination,
  setTestPrisma,
} from "@/features/server/core/prisma"
import { loadEnvConfig } from "@next/env"
import { PrismaClient } from "@prisma/client"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { pagination } from "prisma-extension-pagination"
import { afterAll, beforeAll } from "vitest"

// load .env.test.local
loadEnvConfig(process.cwd())

let container: StartedPostgreSqlContainer
let testPrisma: typeof prismaClient
let testPaginaionPrisma: typeof prismaPagination

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:latest")
    .withDatabase(process.env.DB_NAME ?? "waiwai")
    .withUsername(process.env.DB_TESTUSER ?? "waiwai")
    .withPassword(process.env.DB_PASSWORD ?? "waiwai")
    .withReuse()
    .start()

  process.env["DATABASE_URL"] =
    `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/waiwai?schema=public`
  execSync("npx prisma migrate deploy", { stdio: "inherit" })

  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
  testPaginaionPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends(pagination())
  setTestPrisma(testPrisma, testPaginaionPrisma)
})

afterAll(async () => {
  await testPrisma.$disconnect()
  await testPaginaionPrisma.$disconnect()
  await container.stop()
})
