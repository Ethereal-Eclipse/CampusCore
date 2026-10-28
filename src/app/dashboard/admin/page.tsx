import { redirect } from "next/navigation"

export default function AdminDashboardPage() {
  redirect("/dashboard/tickets?view=admin")
}
