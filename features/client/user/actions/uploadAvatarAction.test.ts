import "@/lib/testcontainer"

import { ExceptionEnum } from "@/features/server/core/exception"
import { getPrisma } from "@/features/server/core/prisma"
import { mockUser1 } from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { uploadUserAvatarAction } from "./uploadAvatarAction"

describe("uploadAvatarAction test", () => {
  beforeAll(async () => {
    const prisma = getPrisma()
    await prisma.user.create({ data: mockUser1.user })
  })
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test.each([["image/png"], ["image/jpeg"]])(
    "successfully uploads avatar with MIME type: %s",
    async (mimeType) => {
      vi.mocked(getServerSession).mockResolvedValue(mockUser1)

      const form = new FormData()
      const blob = new Blob([], { type: mimeType })
      const file = new File([blob], "mockImage." + mimeType.split("/")[1], {
        type: mimeType,
      })
      form.append("file", file)

      const editUser = await uploadUserAvatarAction(undefined, form)

      const prisma = getPrisma()
      const user = await prisma.user.findUnique({
        where: { id: mockUser1.user.id },
      })

      expect(editUser.value.image).toBe(user?.image)
    }
  )

  test.each([["application/json"], ["text/csv"], ["application/xml"]])(
    "returns error for unsupported MIME type: %s",
    async (mimeType) => {
      vi.mocked(getServerSession).mockResolvedValue(mockUser1)

      const form = new FormData()
      const blob = new Blob([], { type: mimeType })
      const file = new File([blob], "mockData." + mimeType.split("/")[1], {
        type: mimeType,
      })
      form.append("file", file)

      const editUser = await uploadUserAvatarAction(undefined, form)

      expect(editUser.value.code).toBe(
        ExceptionEnum.competitionDataUploadBad.code
      )
    }
  )
})
