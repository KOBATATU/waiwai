import { randomUUID } from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import * as bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"
import { decode, encode } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

import { prismaClient } from "./prisma"

// https://github.com/nextauthjs/next-auth/discussions/4394#discussioncomment-3293618

const adapter = PrismaAdapter(prismaClient)
export const authOption: NextAuthOptions = {
  adapter: adapter,
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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email ?? ""
        const password = credentials?.password ?? ""

        const user = await prismaClient.user.findUnique({
          where: { email },
        })

        const userPassword = user?.password
        if (!user) {
          throw new Error("Username doesn't exist")
        }
        if (!password || !userPassword) {
          throw new Error("Please provide a password")
        }
        const isPasswordCorrect = await bcrypt.compare(password, userPassword)
        if (!isPasswordCorrect) {
          throw new Error("Incorrect Password")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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

export const nextAuthOption = (req: NextRequest): NextAuthOptions => {
  return {
    ...authOption,
    callbacks: {
      ...authOption.callbacks,
      async signIn({ user, account, profile, email, credentials }) {
        if (account?.provider === "credentials") {
          const fromDate = (time: number, date = Date.now()) =>
            new Date(date + time * 1000)

          const sessionToken = randomUUID()
          const sessionMaxAge = 60 * 60 * 24 * 30 // 30Days
          const sessionExpiry = fromDate(sessionMaxAge)

          adapter.createSession &&
            (await adapter.createSession({
              userId: user.id,
              sessionToken: sessionToken,
              expires: sessionExpiry,
            }))

          cookies().set("next-auth.session-token", sessionToken, {
            expires: sessionExpiry,
          })
        }
        return true
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.url?.includes("callback") &&
          req.url.includes("credentials") &&
          req.method === "POST"
        ) {
          const cks = cookies()

          const cookie = cks?.get("next-auth.session-token")

          if (cookie) return cookie.value
          else return ""
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({
          token,
          secret,
          maxAge,
        })
      },
      decode: async ({ token, secret }) => {
        if (
          req.url?.includes("callback") &&
          req.url.includes("credentials") &&
          req.method === "POST"
        ) {
          return null
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret })
      },
    },
  }
}
