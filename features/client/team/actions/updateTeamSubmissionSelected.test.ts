import { notFound } from "next/navigation"
import { ExceptionEnum } from "@/features/server/core/exception"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
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

import { updateTeamSubmissionSelectedAction } from "./updateTeamSubmissionSelected"

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
    form.append("id", "test-id")
    form.append("selected", "on")

    await updateTeamSubmissionSelectedAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("update team submission selected success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)

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
    const teamSubmission = await prisma.teamSubmission.create({
      data: {
        userId: mockUser1.user.id,
        teamId: team.id,
        status: EnumTeamSubmissionStatus.success,
        selected: false,
      },
    })

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", teamSubmission.id)
    form.append("selected", "on")

    await updateTeamSubmissionSelectedAction(undefined, form)

    const result = await prisma.teamSubmission.findUnique({
      where: {
        id: teamSubmission.id,
      },
    })

    expect(result?.selected).toBe(true)
  })

  test("competition not start because of startDate > now", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() - 1))

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", "test-id")
    form.append("selected", "on")

    const result = await updateTeamSubmissionSelectedAction(undefined, form)

    expect(result.value.code).toBe(ExceptionEnum.competitionNotStart.code)
  })

  test("competition end because of endDate < now", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", "test-id")
    form.append("selected", "on")

    const result = await updateTeamSubmissionSelectedAction(undefined, form)

    expect(result.value.code).toBe(ExceptionEnum.competitionEnd.code)
  })

  test("user doesn't participate competition ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", "test-id")
    form.append("selected", "on")

    const result = await updateTeamSubmissionSelectedAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("submission id is missed ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser2)
    const mockNotFound = vi.mocked(notFound)
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: "test2",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: mockUser2.user.id,
      },
    })
    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", "test-id")
    form.append("selected", "on")

    await updateTeamSubmissionSelectedAction(undefined, form)
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("submission selected count > 2. but payload selected === on ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

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
    await prisma.teamSubmission.create({
      data: {
        userId: mockAdminUser1.user.id,
        teamId: team.id,
        status: EnumTeamSubmissionStatus.success,
        selected: true,
      },
    })
    await prisma.teamSubmission.create({
      data: {
        userId: mockAdminUser1.user.id,
        teamId: team.id,
        status: EnumTeamSubmissionStatus.success,
        selected: true,
      },
    })
    const teamSubmission = await prisma.teamSubmission.create({
      data: {
        userId: mockAdminUser1.user.id,
        teamId: team.id,
        status: EnumTeamSubmissionStatus.success,
        selected: false,
      },
    })

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("id", teamSubmission.id)
    form.append("selected", "on")

    const result = await updateTeamSubmissionSelectedAction(undefined, form)
    expect(result.value.code).toBe(ExceptionEnum.teamSubmissionCountOver.code)
  })
})
