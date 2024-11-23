import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import { EvaluationFuncEnum } from "@/features/server/domain/competition/competition"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { updateCompetitionAction } from "./updateCompetitionSettingAction"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("updateCompetitionAction test", () => {
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

      await updateCompetitionAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("update updateCompetitionSettings success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const form = new FormData()
    form.append("id", competitionDefault.id)
    form.append("title", "test title")
    form.append("subtitle", "test subtitle")
    form.append("startDate", "2024-11-19")
    form.append("endDate", "2024-11-30")
    form.append("open", "")
    form.append("evaluationFunc", EvaluationFuncEnum.regression.rmse.value)
    form.append("testDataRate", "10")
    form.append("limitSubmissionNum", "100")
    await updateCompetitionAction(undefined, form)
    const prisma = getPrisma()
    const result = await prisma.competition.findUnique({
      where: {
        id: competitionDefault.id,
      },
    })
    expect(result?.title).toBe("test title")
    expect(result?.subtitle).toBe("test subtitle")
    expect(result?.startDate.toISOString()).toBe("2024-11-19T00:00:00.000Z")
    expect(result?.endDate.toISOString()).toBe("2024-11-30T00:00:00.000Z")
    expect(result?.open).toBe(false)
    expect(result?.evaluationFunc).toBe(
      EvaluationFuncEnum.regression.rmse.value
    )
    expect(result?.testDataRate).toBe(10)
    expect(result?.limitSubmissionNum).toBe(100)
  })
})
