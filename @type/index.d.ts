import { UserRole } from "@/features/server/domain/user/user"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role: UserRole
  }
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GCS_PROJECT_ID: string
      GCS_APPLICATION_CREDENTIALS: string
      GCS_BUCKET: string
    }
  }
}
