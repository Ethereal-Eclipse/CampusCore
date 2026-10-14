import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    const response = NextResponse.next()
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    )
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  },
  {
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*"],
}
