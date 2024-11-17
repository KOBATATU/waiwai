import "@/lib/testcontainer"

import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
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

import { createCompetitionAction } from "./createCompetitionAction"

describe("updateTeamSubmissionSelectedAction test", () => {
  beforeEach(() => {
    vi.resetAllMocks()
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
      form.append("title", "title")
      form.append("subtitle", "subtitle")

      await createCompetitionAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("create competition success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

    const form = new FormData()
    form.append("title", "title")
    form.append("subtitle", "subtitle")

    const competition = await createCompetitionAction(undefined, form)
    const prisma = getPrisma()
    const result = await prisma.competition.findUnique({
      where: {
        id: competition.value.id,
      },
    })

    expect(result?.title).toBe("title")
    expect(result?.subtitle).toBe("subtitle")
  })
})
