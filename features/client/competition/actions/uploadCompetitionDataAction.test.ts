import "@/lib/testcontainer"

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

import { uploadCompetitionDataAction } from "./uploadCompetitionDataAction"

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

      await uploadCompetitionDataAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test.each([
    ["image/png"],
    ["image/jpeg"],
    ["application/xml"],
    ["text/tab-separated-values"],
  ])("returns error for unsupported MIME type: %s", async (mimeType) => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const form = new FormData()
    const blob = new Blob([], { type: mimeType })
    const file = new File([blob], "mockData." + mimeType.split("/")[1], {
      type: mimeType,
    })
    form.append("file", file)
    form.append("id", competitionDefault.id)

    const editUser = await uploadCompetitionDataAction(undefined, form)

    expect(editUser.value.code).toBe(
      ExceptionEnum.competitionDataUploadBad.code
    )
  })

  test("uploadCompetitionDataAction success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const form = new FormData()
    const blob = new Blob([], { type: "text/csv" })
    const file = new File([blob], "mockData.csv", {
      type: "text/csv",
    })
    form.append("file", file)
    form.append("id", competitionDefault.id)

    const competitionData = await uploadCompetitionDataAction(undefined, form)
    const prisma = getPrisma()
    const result = await prisma.competitionData.findUnique({
      where: {
        id: competitionData.value.id,
      },
    })

    expect(result?.dataPath).toBeTruthy()
  })
})
