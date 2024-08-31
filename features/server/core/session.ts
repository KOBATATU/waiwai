import { getServerSession as NextAuthServerSession } from "next-auth"

import { authOption } from "./auth"

export const getServerSession = async () => {
  return await NextAuthServerSession(authOption)
}
