import "@/lib/testcontainer"

import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { downloadCompetitionDataRepository } from "@/features/server/repository/competition/downloadRepository"
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

import { downloadCompetitionDataAction } from "./downloadCompetitionDataAction"

vi.mock(
  "@/features/server/repository/competition/downloadRepository",
  async () => {
    const originalModule = await vi.importActual(
      "@/features/server/repository/competition/downloadRepository"
    )
    return {
      ...originalModule,
      downloadCompetitionDataRepository: {
        // @ts-ignore
        ...originalModule.downloadCompetitionDataRepository,
        downloadData: vi.fn(),
      },
    }
  }
)

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

  test.each([[null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      const form = new FormData()
      form.append("id", competitionDefault.id)

      await downloadCompetitionDataAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("downloadCompetitionDataAction success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const mockDownloadUrl = vi.mocked(
      downloadCompetitionDataRepository.downloadData
    )
    mockDownloadUrl.mockResolvedValue("download-testpath")

    const prisma = getPrisma()
    const competitionData = await prisma.competitionData.create({
      data: {
        dataPath: "testpath",
        competitionId: competitionDefault.id,
      },
    })
    const form = new FormData()
    form.append("competitionDataId", competitionData.id)
    const result = await downloadCompetitionDataAction(undefined, form)

    expect(result.value.url).toBe("download-testpath")
  })

  test("user not participate competition", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)
    const mockDownloadUrl = vi.mocked(
      downloadCompetitionDataRepository.downloadData
    )
    mockDownloadUrl.mockResolvedValue("download-testpath")

    const prisma = getPrisma()
    const competitionData = await prisma.competitionData.create({
      data: {
        dataPath: "testpath",
        competitionId: competitionDefault.id,
      },
    })
    const form = new FormData()
    form.append("competitionDataId", competitionData.id)
    await downloadCompetitionDataAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("competition data not exist", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)
    const form = new FormData()
    form.append("competitionDataId", "testid")
    await downloadCompetitionDataAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})
