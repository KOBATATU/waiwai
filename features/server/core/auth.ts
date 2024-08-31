import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { prismaClient } from "./prisma"

export const authOption: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "database",
    /** session 7 days */
    maxAge: 7 * 24 * 60 * 60,
    /** Frequency of extending the session information validity(After updateAge passes, the session validity is extended up to maxAge) */
    /** 1 days */
    updateAge: 24 * 60 * 60,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          role: profile.role ?? "user",
          id: profile.id,
          name: profile.name,
          image: profile.avatar_url,
          email: profile.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      /** security lisk */
      session.user.email = ""
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
