import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import {
  mockAdminUser1,
  mockUser1,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { getUserClientService } from "./getUserService"

describe("getUserService test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    vi.resetAllMocks()
  })
  test.each([[mockUser1], [null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      await getUserClientService.getUsersByAdmin(1)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("getUsersByAdmin test", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const result = await getUserClientService.getUsersByAdmin(1)

    expect(result[0][0].id).toBe(mockUser1.user.id)
    expect(result[0][1].id).toBe(mockAdminUser1.user.id)
    expect(result[1].totalCount).toBe(2)
  })
})
