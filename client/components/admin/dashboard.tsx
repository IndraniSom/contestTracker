"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  FilePlus,
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Trophy,
  Users,
  Youtube,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Mock data for contests
const recentContests = [
  { id: "1", title: "Weekly Contest #123", date: "2023-12-15", status: "completed", participants: 1245, solutions: 3 },
  { id: "2", title: "Biweekly Contest #45", date: "2023-12-22", status: "active", participants: 876, solutions: 0 },
  { id: "3", title: "Special Holiday Contest", date: "2023-12-28", status: "upcoming", participants: 0, solutions: 0 },
  { id: "4", title: "Algorithm Challenge #67", date: "2024-01-05", status: "upcoming", participants: 0, solutions: 0 },
]

// Mock data for solutions
const recentSolutions = [
  {
    id: "1",
    contestTitle: "Weekly Contest #123",
    youtubeLink: "https://youtube.com/watch?v=abc123",
    addedOn: "2023-12-16",
    views: 342,
  },
  {
    id: "2",
    contestTitle: "Weekly Contest #122",
    youtubeLink: "https://youtube.com/watch?v=def456",
    addedOn: "2023-12-09",
    views: 567,
  },
  {
    id: "3",
    contestTitle: "Biweekly Contest #44",
    youtubeLink: "https://youtube.com/watch?v=ghi789",
    addedOn: "2023-12-02",
    views: 289,
  },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className=" w-full flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button> */}
              {/* <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Contest
              </Button> */}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contests">Contests</TabsTrigger>
              <TabsTrigger value="solutions">Add Solutions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Total Contests"
                  value="24"
                  description="4 active contests"
                  icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                  title="Total Solutions"
                  value="18"
                  description="3 added this month"
                  icon={<Youtube className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                  title="Total Users"
                  value="1,234"
                  description="↗︎ 145 (12%)"
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                  title="Solution Views"
                  value="12.5K"
                  description="↗︎ 3.2K (24%)"
                  icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Contests</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/contests">View all</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentContests.slice(0, 3).map((contest) => (
                        <div key={contest.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{contest.title}</p>
                            <p className="text-xs text-muted-foreground">{contest.date}</p>
                          </div>
                          <StatusBadge status={contest.status} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/add-contest">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Contest
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Solutions</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/solutions">View all</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentSolutions.slice(0, 3).map((solution) => (
                        <div key={solution.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{solution.contestTitle}</p>
                            <p className="text-xs text-muted-foreground">Added on {solution.addedOn}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{solution.views} views</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/admin/add-solution">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Solution
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contests" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Contests</CardTitle>
                    <Button size="sm" asChild>
                      <Link href="/admin/add-contest">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Contest
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>Manage your contests and their solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContests.map((contest) => (
                      <div
                        key={contest.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{contest.title}</p>
                            <StatusBadge status={contest.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">Date: {contest.date}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <p>{contest.participants} participants</p>
                            <p>{contest.solutions} solutions</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {contest.status !== "completed" ? (
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/add-solution?contestId=${contest.id}`}>Add Solution</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="solutions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Solutions</CardTitle>
                    <Button size="sm" asChild>
                      <Link href="/admin/add-solution">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Solution
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>Manage your YouTube solutions for past contests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSolutions.map((solution) => (
                      <div
                        key={solution.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{solution.contestTitle}</p>
                          <p className="text-sm text-muted-foreground">Added on {solution.addedOn}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Youtube className="h-4 w-4 text-red-500" />
                            <a
                              href={solution.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              YouTube Link
                            </a>
                            <span className="text-muted-foreground">({solution.views} views)</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  )
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
        Completed
      </Badge>
    )
  } else if (status === "active") {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        Active
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
        Upcoming
      </Badge>
    )
  }
}

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <Trophy className="h-6 w-6" />
          <span className="font-bold">Contest Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/contests">
                <Trophy className="h-4 w-4" />
                <span>Contests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/add-solution">
                <Youtube className="h-4 w-4" />
                <span>Add Solutions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/add-contest">
                <FilePlus className="h-4 w-4" />
                <span>New Contest</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/add-solution">
                <PlusCircle className="h-4 w-4" />
                <span>Add Solution</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  )
}

