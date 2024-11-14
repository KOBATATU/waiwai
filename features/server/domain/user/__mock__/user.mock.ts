import { Session } from "next-auth"

export const mockAdminUser1: Session = {
  user: {
    id: "mock-user-id",
    role: "admin",
    name: "Mock User",
    email: "mock@example.com",
  },
  expires: "9999-12-31T23:59:59.999Z",
} as const
export const mockUser1: Session = {
  user: {
    id: "mock-user-id",
    role: "user",
    name: "Mock User",
    email: "mock@example.com",
  },
  expires: "9999-12-31T23:59:59.999Z",
} as const
