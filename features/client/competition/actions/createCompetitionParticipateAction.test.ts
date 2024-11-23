import { notFound } from "next/navigation"
import { ExceptionEnum } from "@/features/server/core/exception"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { createCompetitionParticipateAction } from "./createCompetitionParticipateAction"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("updateTeamSubmissionSelectedAction test", () => {
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
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  test("access user doesn't have permission", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const mockNotFound = vi.mocked(notFound)
    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    await createCompetitionParticipateAction(undefined, form)
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("user participate competition success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const form = new FormData()
    form.append("id", competitionDefault.id)
    await createCompetitionParticipateAction(undefined, form)

    const prisma = getPrisma()
    const result = await prisma.competitionParticipate.findFirst({
      where: {
        competitionId: competitionDefault.id,
        userId: mockUser1.user.id,
      },
    })
    expect(!!result).toBe(true)
  })

  test("competition not start because of startDate > now ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() - 1))
    const form = new FormData()
    form.append("id", competitionDefault.id)
    const result = await createCompetitionParticipateAction(undefined, form)

    expect(result.value.code).toBe(ExceptionEnum.competitionNotStart.code)
  })
  test("competition end because of endDate < now  ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))
    const form = new FormData()
    form.append("id", competitionDefault.id)
    const result = await createCompetitionParticipateAction(undefined, form)

    expect(result.value.code).toBe(ExceptionEnum.competitionEnd.code)
  })

  test("user already participate competition ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser2)
    const prisma = getPrisma()
    await prisma.competitionParticipate.create({
      data: {
        userId: mockUser2.user.id,
        competitionId: competitionDefault.id,
      },
    })
    const form = new FormData()
    form.append("id", competitionDefault.id)
    const result = await createCompetitionParticipateAction(undefined, form)

    expect(result.value.code).toBe(ExceptionEnum.competitionParticipateBad.code)
  })
})
