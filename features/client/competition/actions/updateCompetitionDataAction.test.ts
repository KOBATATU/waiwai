import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { updateCompetitioDataAction } from "./updateCompetitionDataAction"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("updateCompetitioDataAction test", () => {
  beforeAll(async () => {})
  beforeEach(async () => {
    await cleanupDatabase()
    vi.resetAllMocks()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })
    await prisma.competition.create({
      data: competitionDefault,
    })
  })

  test.each([[mockUser1], [null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      const form = new FormData()
      form.append("id", competitionDefault.id)

      await updateCompetitioDataAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("update competitionData success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const prisma = getPrisma()

    const form = new FormData()
    form.append("id", competitionDefault.id)
    form.append("dataDescription", "testdata description")
    await updateCompetitioDataAction(undefined, form)

    const result = await prisma.competition.findUnique({
      where: {
        id: competitionDefault.id,
      },
    })
    expect(result?.dataDescription).toBe("testdata description")
  })
})
