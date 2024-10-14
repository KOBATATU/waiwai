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
