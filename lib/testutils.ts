import { getPrisma } from "@/features/server/core/prisma"
import { Prisma } from "@prisma/client"

const prisma = getPrisma()
export async function cleanupDatabase() {
  console.log(process.env["DATABASE_URL"])
  const tableNames = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  )
  for (const table of tableNames) {
    if (!table) return
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`)
  }
}
