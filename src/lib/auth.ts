import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./mongoose"
import User from "@/models/User"

const googleClientId =
  process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || ""
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || ""

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
        const role = credentials.role === "admin" ? "admin" : "student"
        const name = credentials.name?.trim() || (role === "admin" ? "Admin User" : "Student")

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
            } else if (dbUser.name !== name) {
              dbUser.name = name
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
        const campusDomain = process.env.CAMPUS_DOMAIN
        if (
          campusDomain &&
          !user.email?.toLowerCase().endsWith(`@${campusDomain.toLowerCase()}`)
        ) {
          return "/login?error=AccessDenied"
        }

        if (process.env.MONGODB_URI) {
          try {
            await connectDB()
            let dbUser = await User.findOne({ email: user.email })
            if (!dbUser) {
              dbUser = await User.create({
                name: user.name || "Student",
                email: user.email,
                image: user.image,
                role: "student",
              })
            } else if (user.image && dbUser.image !== user.image) {
              dbUser.image = user.image
              await dbUser.save()
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
        token.role = user.role || "student"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string)
        session.user.role = (token.role as "student" | "admin") || "student"
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
