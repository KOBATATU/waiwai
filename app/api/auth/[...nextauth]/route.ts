import { NextRequest } from "next/server"
import { nextAuthOption } from "@/features/server/core/auth"
import NextAuth from "next-auth"

interface RouteHandlerContext {
  params: { nextauth: string[] }
}

const authHandler = async (req: NextRequest, params: RouteHandlerContext) => {
  return await NextAuth(req, params, nextAuthOption(req))
}

export { authHandler as GET, authHandler as POST }
