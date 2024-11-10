import { UserSchema } from "@/prisma/generated/zod"
import { z } from "zod"

export const UserSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
})
export const UserSigninSchema = UserSignupSchema.pick({
  email: true,
  password: true,
})

export const UserRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
  id: z.string(),
})

export const UserNameSchema = z.object({
  name: z.string({ required_error: "required" }),
})

export const UserAvatarSchema = z.object({
  file: z.instanceof(File),
})
