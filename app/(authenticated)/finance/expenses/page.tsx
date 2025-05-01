import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"

export default async function ExpensesPage() {
  const supabase = await createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expenses Tracker</h2>
        <p className="text-muted-foreground">Track and manage your household expenses</p>
      </div>

      <div className="border rounded-lg p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Expense Tracking Coming Soon</h3>
          <p className="text-muted-foreground">
            This feature is currently under development. Soon you'll be able to track and categorize all your household
            expenses.
          </p>
        </div>
      </div>
    </div>
  )
}
