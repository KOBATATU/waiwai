import "@/lib/testcontainer"

import { notFound, redirect } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import {
  mockAdminUser1,
  mockUser1,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getTeamService } from "@/features/server/service/team/getService"
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

import { submitCsvFileAction } from "./submitCsvFileAction"

vi.mock("@/features/server/service/team/getService", async () => {
  const originalModule = await vi.importActual(
    "@/features/server/service/team/getService"
  )

  return {
    ...originalModule,
    getTeamService: {
      // @ts-ignore
      ...originalModule.getTeamService,
      getEvaluationScore: vi.fn(), // モック関数を定義
    },
  }
})

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("submitCsvFileAction test", () => {
  beforeAll(async () => {
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.competition.create({
      data: competitionDefault,
    })
  })
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  test("access user doesn't have permission", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const mockNotFound = vi.mocked(notFound)

    const form = new FormData()
    form.append("competitionId", "test-id")
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData." + "csv", {
      type: "text/csv",
    })
    form.append("file", file)

    await submitCsvFileAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("user compeition csv file submit scuccess", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockScore = { public_score: 10, private_score: 5 }
    const mockGetTeamScore = vi.mocked(getTeamService.getEvaluationScore)
    mockGetTeamScore.mockResolvedValue(mockScore)
    const redirectMock = vi.mocked(redirect)
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() + 48 * 60 * 60 * 1000)
    )
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: mockUser1.user.id,
      },
    })

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData." + "csv", {
      type: "text/csv",
    })
    form.append("file", file)
    const result = await submitCsvFileAction(undefined, form)

    // submitCsvFileAction async api ,must wait a few minutes
    await new Promise((resolve) => setTimeout(resolve, 2000))

    expect(redirectMock).toHaveBeenCalledOnce()
    expect(mockGetTeamScore).toHaveBeenCalledOnce()
    const teamSubmissions = await prisma.teamSubmission.findMany()

    expect(teamSubmissions.length).toBe(1)
    expect(teamSubmissions[0].status).toBe(EnumTeamSubmissionStatus.success)
    expect(teamSubmissions[0].publicScore).toBe(mockScore.public_score)
    expect(teamSubmissions[0].privateScore).toBe(mockScore.private_score)
  })
})
