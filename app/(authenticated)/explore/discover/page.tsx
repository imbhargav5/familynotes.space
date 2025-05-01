import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { Search, Filter, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DiscoverPage() {
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
        <h2 className="text-2xl font-bold tracking-tight">Discover</h2>
        <p className="text-muted-foreground">Explore new templates, ideas, and community content</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates, notes, and more..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="trending">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        <TabsContent value="trending" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending This Week
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Meal Planner</CardTitle>
                <CardDescription>By Family Notes Team</CardDescription>
              </CardHeader>
              <CardContent>
                <p>A comprehensive template to plan your family's meals for the entire week.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family Budget Tracker</CardTitle>
                <CardDescription>By Finance Experts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Track your family's income and expenses with this easy-to-use template.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Homework Schedule</CardTitle>
                <CardDescription>By Education Specialists</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Help your children stay organized with this homework planning template.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="pt-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Template Library Coming Soon</h3>
            <p className="text-muted-foreground">
              Our template library is currently under development. Check back soon for a wide variety of templates!
            </p>
          </div>
        </TabsContent>

        <TabsContent value="community" className="pt-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Community Content Coming Soon</h3>
            <p className="text-muted-foreground">
              Community sharing features are currently under development. Soon you'll be able to discover content from
              other users!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
