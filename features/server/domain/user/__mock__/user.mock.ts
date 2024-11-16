import { Session } from "next-auth"

export const mockAdminUser1: Session = {
  user: {
    id: "mock-user-id1",
    role: "admin",
    name: "Mock User1",
    email: "mock1@example.com",
  },
  expires: "9999-12-31T23:59:59.999Z",
} as const
export const mockUser1: Session = {
  user: {
    id: "mock-user-id2",
    role: "user",
    name: "Mock User2",
    email: "mock2@example.com",
  },
  expires: "9999-12-31T23:59:59.999Z",
} as const
export const mockUser2: Session = {
  user: {
    id: "mock-user-id-3",
    role: "user",
    name: "Mock User3",
    email: "mock3@example.com",
  },
  expires: "9999-12-31T23:59:59.999Z",
} as const
