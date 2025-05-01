import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function GamesPage() {
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
        <h2 className="text-2xl font-bold tracking-tight">Family Games</h2>
        <p className="text-muted-foreground">Fun activities for the whole family</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Family Trivia</CardTitle>
            <CardDescription>Test your knowledge together</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Users className="mr-1 h-4 w-4" />
              <span>2-8 players</span>
            </div>
            <p>A fun trivia game with categories for all ages. Perfect for family game night!</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Play Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word Scramble</CardTitle>
            <CardDescription>Unscramble words against the clock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Users className="mr-1 h-4 w-4" />
              <span>1+ players</span>
            </div>
            <p>Race against time to unscramble as many words as possible. Great for vocabulary building!</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Play Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Match</CardTitle>
            <CardDescription>Find matching pairs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Users className="mr-1 h-4 w-4" />
              <span>1-4 players</span>
            </div>
            <p>Test and improve your memory by finding matching pairs. Multiple difficulty levels available.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Play Now</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Family Leaderboard
          </h3>
          <Button variant="outline">View All</Button>
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground">Play games to start building your family leaderboard!</p>
        </div>
      </div>
    </div>
  )
}
