
import type React from "react"

import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar/sidebar"
import { UserProfile } from "@/components/user-profile"
import { createClient } from "@/lib/supabase-server"

export  default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error || !data?.session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Family Notes</h1>
          </div>
          <UserProfile />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
