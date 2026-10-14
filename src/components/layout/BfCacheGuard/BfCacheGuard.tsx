"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function BfCacheGuard() {
  const { status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.replace("/login")
    }

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [status])

  return null
}
