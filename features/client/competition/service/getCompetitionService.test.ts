import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import {
  EvaluationFuncEnum,
  ProblemEnum,
} from "@/features/server/domain/competition/competition"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { getCompetitionClientService } from "./getCompetitionService"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("getCompetitionClientService getCompetitionsByAdmin test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
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

      await getCompetitionClientService.getCompetitionsByAdmin(1)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("get getCompetitionsByAdmin success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const result = await getCompetitionClientService.getCompetitionsByAdmin(1)

    expect(result[0][0].id).toBe(competitionDefault.id)
    expect(result[1].totalCount).toBe(1)
  })
})

describe("getCompetitionClientService getCompetitionByAdmin test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
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

      await getCompetitionClientService.getCompetitionByAdmin(
        competitionDefault.id
      )
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("get getCompetitionsByAdmin success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const result = await getCompetitionClientService.getCompetitionByAdmin(
      competitionDefault.id
    )

    expect(result.id).toBe(competitionDefault.id)
  })

  test("get getCompetitionsByAdmin not found", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const mockNotFound = vi.mocked(notFound)
    await getCompetitionClientService.getCompetitionByAdmin("hoge")
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})

describe("getCompetitionClientService getCompetitions test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.competition.create({
      data: competitionDefault,
    })
    vi.resetAllMocks()
  })

  test("get getCompetitions success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const result = await getCompetitionClientService.getCompetitions(1)

    expect(result[0][0].id).toBe(competitionDefault.id)
    expect(result[1].totalCount).toBe(1)
  })
})

describe("getCompetitionClientService getCompetitionById test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.competition.create({
      data: competitionDefault,
    })
    vi.resetAllMocks()
  })

  test("get getCompetitionById success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const result = await getCompetitionClientService.getCompetitionById(
      competitionDefault.id
    )

    expect(result.id).toBe(competitionDefault.id)
  })

  test("get getCompetitionById not found not open", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const mockNotFound = vi.mocked(notFound)
    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        id: "test2",
        open: false,
      },
    })

    await getCompetitionClientService.getCompetitionById(competition.id)
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("get getCompetitionById not found ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const mockNotFound = vi.mocked(notFound)

    await getCompetitionClientService.getCompetitionById("hoge")
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})
