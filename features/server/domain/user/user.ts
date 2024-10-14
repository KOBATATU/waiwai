import { z } from "zod"

export const UserSignupSchema = z.object({
  name: z.string().min(1, "aa"),
  email: z.string().email(),
  password: z.string(),
})
