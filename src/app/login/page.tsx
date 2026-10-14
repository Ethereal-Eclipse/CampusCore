"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { Bld } from "@/components/ui/Icons"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-[20px] text-[var(--color-ink)]">
      <Link
        href="/"
        className="flex items-center gap-[10px] font-bold text-[24px] mb-[40px]"
      >
        <i className="w-[34px] h-[34px] rounded-[10px] bg-[var(--color-navy)] text-white grid place-items-center not-italic">
          C
        </i>
        CampusCore
      </Link>

      <div className="bg-[var(--color-card-ref)] p-[30px] rounded-[18px] w-full max-w-[400px] border border-[var(--color-line)] shadow-[var(--shadow-sh)] text-center">
        <h3 className="text-[20px] font-bold mb-[10px] text-[var(--color-navy)]">
          Log in to CampusCore
        </h3>
        <p className="text-[var(--color-mut)] text-[14px] mb-[24px]">
          Sign in with your campus Google account.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full px-[26px] py-[12px] rounded-full bg-[var(--color-navy)] text-white font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.3)] flex items-center justify-center gap-[10px]"
        >
          Sign in with Google
        </button>

        {process.env.NODE_ENV === "development" && (
          <button
            onClick={() =>
              signIn("credentials", {
                name: "Developer",
                email: "dev@glbitm.ac.in",
                callbackUrl: "/dashboard",
              })
            }
            className="w-full mt-[12px] px-[26px] py-[12px] rounded-full bg-[var(--color-card-ref)] text-[var(--color-ink)] border border-[var(--color-line)] font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.3)] flex items-center justify-center gap-[10px]"
          >
            Development Fallback
          </button>
        )}
      </div>
    </div>
  )
}
