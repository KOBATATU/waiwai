import "@/lib/testcontainer"

import { notFound, redirect } from "next/navigation"
import { ExceptionEnum } from "@/features/server/core/exception"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
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
      getEvaluationScore: vi.fn(),
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
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })
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
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() - 9 * 60 * 60 * 1000 + 1)
    )
    const redirectMock = vi.mocked(redirect)
    const mockGetTeamScore = vi.mocked(getTeamService.getEvaluationScore)
    const mockScore = { public_score: 10, private_score: 5 }
    mockGetTeamScore.mockResolvedValue(mockScore)

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

  test.each([
    ["image/png"],
    ["image/jpeg"],
    ["application/xml"],
    ["text/tab-separated-values"],
  ])("returns error for unsupported MIME type: %s", async (mimeType) => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() - 9 * 60 * 60 * 1000 + 1)
    )

    const form = new FormData()
    const blob = new Blob([], { type: mimeType })
    const file = new File([blob], "mockData." + mimeType.split("/")[1], {
      type: mimeType,
    })
    form.append("file", file)
    form.append("competitionId", competitionDefault.id)

    const editUser = await submitCsvFileAction(undefined, form)

    expect(editUser.value.code).toBe(
      ExceptionEnum.competitionDataUploadBad.code
    )
  })

  test("competition not start because of startDate > now ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() - 9 * 60 * 60 * 1000 - 1)
    )
    const form = new FormData()
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData." + "csv", {
      type: "text/csv",
    })
    form.append("file", file)
    form.append("competitionId", competitionDefault.id)

    const editUser = await submitCsvFileAction(undefined, form)

    expect(editUser.value.code).toBe(ExceptionEnum.competitionNotStart.code)
  })

  test("competition not start because of not open(user cannn't get competition)", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)

    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        id: "test",
        open: false,
      },
    })
    const form = new FormData()
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData." + "csv", {
      type: "text/csv",
    })
    form.append("file", file)
    form.append("competitionId", competition.id)

    await submitCsvFileAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("user doesn't participate competition ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser2)
    const mockNotFound = vi.mocked(notFound)
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() - 9 * 60 * 60 * 1000 + 1)
    )
    const form = new FormData()
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData." + "csv", {
      type: "text/csv",
    })
    form.append("file", file)
    form.append("competitionId", competitionDefault.id)

    const editUser = await submitCsvFileAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("waiwai api error", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    vi.setSystemTime(
      new Date(competitionDefault.startDate.getTime() - 9 * 60 * 60 * 1000 + 1)
    )
    const mockGetTeamScore = vi.mocked(getTeamService.getEvaluationScore)

    mockGetTeamScore.mockImplementation(() => {
      return Promise.reject(new Error("error"))
    })

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
        userId: mockAdminUser1.user.id,
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
    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(mockGetTeamScore).toHaveBeenCalledOnce()
    const teamSubmissions = await prisma.teamSubmission.findMany({
      where: {
        userId: mockAdminUser1.user.id,
      },
    })
    expect(teamSubmissions.length).toBe(1)
    expect(teamSubmissions[0].status).toBe(EnumTeamSubmissionStatus.error)
    expect(teamSubmissions[0].publicScore).toBe(null)
    expect(teamSubmissions[0].privateScore).toBe(null)
  })
})
