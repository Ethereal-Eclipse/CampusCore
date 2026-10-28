import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./mongoose"
import User from "@/models/User"

const googleClientId =
  process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || ""
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || ""

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const lower = email.trim().toLowerCase()
  const whitelist = (
    process.env.ADMIN_EMAILS ||
    "admin@glbitm.ac.in,sharmanaman1809@gmail.com"
  )
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  if (whitelist.includes(lower)) return true
  if (lower.startsWith("admin@") || lower.includes("admin")) return true
  return false
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : [
          GoogleProvider({
            clientId: "dummy-client-id",
            clientSecret: "dummy-client-secret",
          }),
        ]),
    CredentialsProvider({
      id: "credentials",
      name: "Development Fallback",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Student Name" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "student@glbitm.ac.in",
        },
        role: { label: "Role", type: "text", placeholder: "student" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        const email = credentials.email.trim().toLowerCase()
        const isWhitelisted = isAdminEmail(email)
        const role =
          credentials.role === "admin" || isWhitelisted ? "admin" : "student"
        const name =
          credentials.name?.trim() ||
          (role === "admin" ? "Admin User" : "Student")

        if (process.env.MONGODB_URI) {
          try {
            await connectDB()
            let dbUser = await User.findOne({ email })
            if (!dbUser) {
              dbUser = await User.create({
                name,
                email,
                role,
              })
            } else if (dbUser.name !== name || (isWhitelisted && dbUser.role !== "admin")) {
              dbUser.name = name
              if (isWhitelisted) dbUser.role = "admin"
              await dbUser.save()
            }
            return {
              id: dbUser._id.toString(),
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
            }
          } catch (e) {
            console.error("DB error in credentials authorize:", e)
          }
        }

        return {
          id: "dev-user-id",
          name,
          email,
          role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const isWhitelisted = isAdminEmail(user.email)
        const campusDomain = process.env.CAMPUS_DOMAIN
        if (
          campusDomain &&
          !isWhitelisted &&
          !user.email?.toLowerCase().endsWith(`@${campusDomain.toLowerCase()}`)
        ) {
          return "/login?error=AccessDenied"
        }

        if (process.env.MONGODB_URI) {
          try {
            await connectDB()
            let dbUser = await User.findOne({ email: user.email?.toLowerCase() })
            const targetRole = isWhitelisted ? "admin" : "student"

            if (!dbUser) {
              dbUser = await User.create({
                name: user.name || (targetRole === "admin" ? "Admin User" : "Student"),
                email: user.email?.toLowerCase(),
                image: user.image,
                role: targetRole,
              })
            } else {
              if (isWhitelisted && dbUser.role !== "admin") {
                dbUser.role = "admin"
                await dbUser.save()
              }
              if (user.image && dbUser.image !== user.image) {
                dbUser.image = user.image
                await dbUser.save()
              }
            }
            user.id = dbUser._id.toString()
            user.role = dbUser.role
          } catch (e) {
            console.error("DB error during Google sign-in:", e)
          }
        }
        return true
      }

      if (account?.provider === "credentials") {
        return true
      }

      return false
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || (isAdminEmail(user.email) ? "admin" : "student")
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string)
        session.user.role =
          (token.role as "student" | "admin") ||
          (isAdminEmail(session.user.email) ? "admin" : "student")
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}
