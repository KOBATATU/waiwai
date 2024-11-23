import { ExceptionEnum } from "@/features/server/core/exception"
import { getPrisma } from "@/features/server/core/prisma"
import { beforeEach, describe, expect, test } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { signupAction } from "./signupAction"

describe("signupAction test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
  })
  test("user regigster success", async () => {
    const form = new FormData()
    form.append("name", "test")
    form.append("email", "test@gmail.com")
    form.append("password", "testpassword")

    const result = await signupAction(undefined, form)

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { email: "test@gmail.com" },
    })

    expect("test@gmail.com").toBe(user?.email)
  })

  test("email already registered", async () => {
    const form = new FormData()
    form.append("name", "test2")
    form.append("email", "test2@gmail.com")
    form.append("password", "testpassword2")

    await signupAction(undefined, form)
    const result = await signupAction(undefined, form)

    expect(ExceptionEnum.userAlreadyRegisterd.code).toBe(result.value.code)
  })
})
