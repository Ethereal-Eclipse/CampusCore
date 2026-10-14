import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./mongoose"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "dummy",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "dummy",
    }),
    CredentialsProvider({
      name: "Development Fallback",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Test User" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "test@example.edu",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        return {
          id: "1",
          name: credentials.name,
          email: credentials.email,
          role: "student",
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const campusDomain = process.env.CAMPUS_DOMAIN
        if (campusDomain && !user.email?.endsWith(`@${campusDomain}`)) {
          return false
        }

        if (process.env.MONGODB_URI) {
          try {
            await connectDB()
            const existingUser = await User.findOne({ email: user.email })
            if (!existingUser) {
              await User.create({
                name: user.name,
                email: user.email,
                image: user.image,
                role: "student",
              })
            }
          } catch (e) {
            console.error("DB connection failed during sign in", e)
          }
        }
        return true
      }
      if (account?.provider === "credentials") return true
      return false
    },
    async session({ session, token }) {
      if (session.user) {
        if (process.env.MONGODB_URI) {
          try {
            await connectDB()
            const dbUser = await User.findOne({ email: session.user.email })
            if (dbUser) {
              ;(session.user as any).role = dbUser.role
              ;(session.user as any).id = dbUser._id.toString()
            }
          } catch (e) {
            ;(session.user as any).role = "student"
          }
        } else {
          ;(session.user as any).role = "student"
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/", // Or a dedicated login page
  },
  session: {
    strategy: "jwt",
  },
}
