import { getPrisma } from "@/features/server/core/prisma"
import { mockUser1 } from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { updateUserAction } from "./updateUserAction"

describe("updateUserAction test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockUser1.user })
    vi.resetAllMocks()
  })

  test("user change name success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)

    const form = new FormData()
    form.append("name", "change_test")

    await updateUserAction(undefined, form)
    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { id: mockUser1.user.id },
    })

    expect("change_test").toBe(user?.name)
  })
})
