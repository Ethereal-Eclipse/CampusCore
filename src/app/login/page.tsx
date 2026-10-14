"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Grid } from "@/components/ui/Icons"

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [devName, setDevName] = useState("Naman Sharma")
  const [devEmail, setDevEmail] = useState("naman@glbitm.ac.in")
  const [devRole, setDevRole] = useState<"student" | "admin">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [showDevPanel, setShowDevPanel] = useState(false)

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    signIn("google", { callbackUrl })
  }

  const handleDevSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    signIn("credentials", {
      name: devName,
      email: devEmail,
      role: devRole,
      callbackUrl,
    })
  }

  const handleQuickDemo = (role: "student" | "admin") => {
    setIsLoading(true)
    signIn("credentials", {
      name: role === "admin" ? "Admin User" : "Naman Sharma",
      email: role === "admin" ? "admin@glbitm.ac.in" : "naman@glbitm.ac.in",
      role,
      callbackUrl,
    })
  }

  return (
    <div className="w-full max-w-[420px] bg-[var(--color-card-ref)] p-[32px] rounded-[20px] border border-[var(--color-line)] shadow-[var(--shadow-sh)]">
      <div className="text-center mb-[28px]">
        <h2 className="text-[22px] font-bold text-[var(--color-ink)] mb-[8px]">
          Welcome to CampusCore
        </h2>
        <p className="text-[14px] text-[var(--color-mut)]">
          Sign in to access your student services and portal
        </p>
      </div>

      {error === "AccessDenied" && (
        <div className="mb-[20px] p-[12px_14px] rounded-[10px] bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-[13px] leading-relaxed">
          Access restricted. Please use your official institutional email
          address to sign in.
        </div>
      )}

      {error && error !== "AccessDenied" && (
        <div className="mb-[20px] p-[12px_14px] rounded-[10px] bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-[13px] leading-relaxed">
          Sign in failed ({error}). Please verify your credentials and try
          again.
        </div>
      )}

      <div className="grid gap-[14px]">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-[12px] px-[20px] rounded-[12px] bg-[var(--color-navy)] text-white font-semibold text-[14px] flex items-center justify-center gap-[12px] shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-[12px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-line)]" />
          </div>
          <span className="relative bg-[var(--color-card-ref)] px-[12px] text-[12px] text-[var(--color-mut)] uppercase tracking-wider">
            development &amp; demo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[10px]">
          <button
            type="button"
            onClick={() => handleQuickDemo("student")}
            disabled={isLoading}
            className="py-[10px] px-[14px] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-ink)] text-[13px] font-medium hover:border-[var(--color-navy)] transition-colors text-center"
          >
            Demo Student
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("admin")}
            disabled={isLoading}
            className="py-[10px] px-[14px] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-ink)] text-[13px] font-medium hover:border-[var(--color-navy)] transition-colors text-center"
          >
            Demo Admin
          </button>
        </div>

        <div className="pt-[10px] text-center">
          <button
            type="button"
            onClick={() => setShowDevPanel(!showDevPanel)}
            className="text-[12px] text-[var(--color-mut)] hover:text-[var(--color-ink)] transition-colors"
          >
            {showDevPanel
              ? "Hide custom credentials"
              : "Custom credentials login"}
          </button>
        </div>

        {showDevPanel && (
          <form
            onSubmit={handleDevSignIn}
            className="grid gap-[12px] pt-[8px] border-t border-[var(--color-line)]"
          >
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                Full Name
              </label>
              <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                required
                className="w-full px-[12px] py-[8px] rounded-[8px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                Campus Email
              </label>
              <input
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                required
                className="w-full px-[12px] py-[8px] rounded-[8px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                Role
              </label>
              <select
                value={devRole}
                onChange={(e) =>
                  setDevRole(e.target.value as "student" | "admin")
                }
                className="w-full px-[12px] py-[8px] rounded-[8px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-[6px] py-[10px] rounded-[10px] bg-[var(--color-card-ref)] border border-[var(--color-navy)] text-[var(--color-navy)] text-[13px] font-semibold hover:bg-[var(--color-navy)] hover:text-white transition-colors"
            >
              Log in with credentials
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-[20px] text-[var(--color-ink)]">
      <Link
        href="/"
        className="flex items-center gap-[10px] font-bold text-[24px] mb-[32px]"
      >
        <i className="w-[36px] h-[36px] rounded-[10px] bg-[var(--color-navy)] text-white grid place-items-center not-italic">
          <Grid className="w-[20px] h-[20px]" />
        </i>
        CampusCore
      </Link>

      <Suspense
        fallback={
          <div className="w-full max-w-[420px] p-[32px] rounded-[20px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-center text-[var(--color-mut)]">
            Loading sign in...
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <div className="mt-[24px] text-center text-[12px] text-[var(--color-mut)]">
        Need assistance? Contact your campus IT helpdesk.
      </div>
    </div>
  )
}
