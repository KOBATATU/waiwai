import { NextApiRequest, NextApiResponse } from "next"
import { nextAuthOption } from "@/features/server/core/auth"
import NextAuth from "next-auth"

const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, nextAuthOption(req, res))
}

export { authHandler as GET, authHandler as POST }
