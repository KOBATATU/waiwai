import { AsyncLocalStorage } from "node:async_hooks"
import { PrismaClient } from "@prisma/client"
import { pagination } from "prisma-extension-pagination"

/**
 * only pagination prisma client
 */
export const prismaPagination = new PrismaClient({
  transactionOptions: {
    timeout: 10000,
  },
}).$extends(pagination())

export const prismaClient = new PrismaClient({
  transactionOptions: {
    timeout: 10000,
  },
})

/**
 * transaction prisma
 */
export type PrismaInnerTransaction = Parameters<
  Parameters<typeof prismaClient.$transaction>[0]
>[0]
export const asyncLocalStorage = new AsyncLocalStorage<PrismaInnerTransaction>()
export const doTransaction = async <T extends object>(
  callback: () => Promise<T>
): Promise<T> => {
  return await prismaClient.$transaction(async (tx) => {
    return await asyncLocalStorage.run(tx, callback)
  })
}

/**
 * get prisma client
 */
type PrismaReturnType<T extends "pagination" | "default"> =
  T extends "pagination"
    ? typeof prismaPagination
    : PrismaClient | PrismaInnerTransaction
export const getPrisma = <T extends "pagination" | "default" = "default">(
  type: T = "default" as T
): PrismaReturnType<T> => {
  switch (type) {
    case "pagination":
      return prismaPagination as PrismaReturnType<T>
    default:
      return (asyncLocalStorage.getStore() ||
        prismaClient) as PrismaReturnType<T>
  }
}
