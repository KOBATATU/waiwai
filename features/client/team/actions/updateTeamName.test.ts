import "@/lib/testcontainer"

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

import { updateTeamNameAction } from "./updateTeamName"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("editUserRoleAction test", () => {
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

  test("access user doesn't have permission", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const mockNotFound = vi.mocked(notFound)

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("name", "testname")
    await updateTeamNameAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("team name change success", async () => {
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

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("name", "testname")
    await updateTeamNameAction(undefined, form)

    const updatedTeam = await prisma.competitionTeam.findUnique({
      where: {
        id: team.id,
      },
    })

    expect(updatedTeam?.name).toBe("testname")
  })

  test("user doesn't participate competition", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser2)
    const mockNotFound = vi.mocked(notFound)

    const form = new FormData()
    form.append("competitionId", competitionDefault.id)
    form.append("name", "testname")
    await updateTeamNameAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})
