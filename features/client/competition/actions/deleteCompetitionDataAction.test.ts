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
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import { deleteCompetitionDataAction } from "./deleteCompetitionDataAction"

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
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  test.each([[mockUser1], [null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      const form = new FormData()
      form.append("id", competitionDefault.id)

      await deleteCompetitionDataAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("delete competitionData success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const prisma = getPrisma()
    const competitionData = await prisma.competitionData.create({
      data: {
        dataPath: "testpath",
        competitionId: competitionDefault.id,
      },
    })

    const form = new FormData()
    form.append("id", competitionData.id)
    await deleteCompetitionDataAction(undefined, form)

    const result = await prisma.competitionData.findUnique({
      where: {
        id: competitionData.id,
      },
    })
    expect(result).toBe(null)
  })
})
