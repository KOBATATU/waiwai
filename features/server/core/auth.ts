import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
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
    // CredentialsProvider({
    //   name: "base-auto",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //     email: {label: "Email", type: "email"}
    //   },
    //   async authorize(credentials, req) {
    //     const email = credentials?.email ?? ''
    //     const username = credentials?.username ?? ''
    //     const password = credentials?.password ?? ''

    //     const user = await prismaClient.user.findUnique({
    //       where: { email },
    //     });

    //     // パスワードの検証（ハッシュ化されたパスワードを使用している場合は適切に比較）
    //     if (user && user.password === password) {
    //       // 認証成功
    //       return {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role,
    //       };
    //     }

    //     // 認証失敗
    //     return null;
    //   },
    // }),
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
