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

import { updateCompetitioOverviewAction } from "./updateCompetitionOverviewAction"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("updateCompetitioOverviewAction test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })
    await prisma.competition.create({
      data: competitionDefault,
    })
    vi.resetAllMocks()
  })

  test.each([[mockUser1], [null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      const form = new FormData()
      form.append("id", competitionDefault.id)

      await updateCompetitioOverviewAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("update competitionOverview success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const prisma = getPrisma()

    const form = new FormData()
    form.append("id", competitionDefault.id)
    form.append("description", "testdata description")
    await updateCompetitioOverviewAction(undefined, form)

    const result = await prisma.competition.findUnique({
      where: {
        id: competitionDefault.id,
      },
    })
    expect(result?.description).toBe("testdata description")
  })
})
