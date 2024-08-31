import { PrismaClient } from "@prisma/client"

export const prismaClient = new PrismaClient({
  transactionOptions: {
    timeout: 10000,
  },
})
