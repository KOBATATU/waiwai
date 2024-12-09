import {
  doTransaction,
  getPrisma,
  prismaClient,
} from "@/features/server/core/prisma"
import { mockUser1 } from "@/features/server/domain/user/__mock__/user.mock"
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { editUserRepository } from "../repository/user/editRepository"

describe("prisma test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
  })

  test("do transaction rollback", async () => {
    const prisma = getPrisma()
    await prisma.user.create({ data: mockUser1.user })
    try {
      await doTransaction(async () => {
        await editUserRepository.editUserById(
          mockUser1.user.id,
          "transactiontest"
        )
        throw new Error("Forced error for rollback")
        return await editUserRepository.editUserById(
          mockUser1.user.id,
          "transactiontest2"
        )
      })
    } catch (error) {}

    const user = await prisma.user.findUnique({
      where: {
        id: mockUser1.user.id,
      },
    })
    expect("Mock User2").toBe(user?.name)
  })
})
