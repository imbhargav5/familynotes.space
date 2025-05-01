import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CoursesPage() {
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
        <h2 className="text-2xl font-bold tracking-tight">Learning Courses</h2>
        <p className="text-muted-foreground">Expand your knowledge with our curated courses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample course cards */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Literacy 101</CardTitle>
            <CardDescription>Learn the basics of personal finance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock className="mr-1 h-4 w-4" />
              <span>8 lessons • 2 hours</span>
            </div>
            <p>Master budgeting, saving, and investing fundamentals for your family's financial well-being.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Learning</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Effective Note Taking</CardTitle>
            <CardDescription>Organize information efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock className="mr-1 h-4 w-4" />
              <span>5 lessons • 1.5 hours</span>
            </div>
            <p>Learn techniques to take better notes and organize information for maximum productivity.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Learning</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Organization</CardTitle>
            <CardDescription>Systems for a well-run household</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock className="mr-1 h-4 w-4" />
              <span>10 lessons • 3 hours</span>
            </div>
            <p>Create systems and routines to keep your family organized, productive, and stress-free.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Learning</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center py-4">
        <p className="text-muted-foreground">More courses coming soon!</p>
      </div>
    </div>
  )
}
