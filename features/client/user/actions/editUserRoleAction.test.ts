import "@/lib/testcontainer"

import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import {
  mockAdminUser1,
  mockUser1,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { editUserRoleAction } from "./editUserRoleAction"

describe("editUserRoleAction test", () => {
  beforeAll(async () => {
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
  })
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test("access user doesn't have permission", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)

    const form = new FormData()
    form.append("id", mockAdminUser1.user.id)
    form.append("role", "user")
    await editUserRoleAction(undefined, form)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test("user change role success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)
    const form = new FormData()
    form.append("id", mockAdminUser1.user.id)
    form.append("role", "user")
    await editUserRoleAction(undefined, form)

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { email: mockAdminUser1.user.email ?? "" },
    })

    expect("user").toBe(user?.role)
  })
})
