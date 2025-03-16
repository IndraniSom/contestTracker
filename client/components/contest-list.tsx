"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformFilter } from "@/components/platform-filter"
import { ContestCard } from "@/components/contest-card"
import type { Contest } from "@/lib/types"
import { fetchContests } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function ContestList() {
  const [contests, setContests] = useState<Contest[]>([])
  const [filteredContests, setFilteredContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]) // Updated to accept strings
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([])

  useEffect(() => {
    // Load contests from API
    const loadContests = async () => {
      setLoading(true)
      try {
        const data = await fetchContests()
        setContests(data)
      } catch (error) {
        console.error("Failed to fetch contests:", error)
      } finally {
        setLoading(false)
      }
    }

    // Load bookmarked contests from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedContests")
    if (savedBookmarks) {
      setBookmarkedContests(JSON.parse(savedBookmarks))
    }

    loadContests()
  }, [])

  useEffect(() => {
    const now = new Date()

    const upcoming = contests.filter(
      (contest) => selectedPlatforms.includes(contest.platform) && new Date(contest.start) > now
    )

    const past = contests.filter(
      (contest) => selectedPlatforms.includes(contest.platform) && new Date(contest.start) <= now
    )

    setFilteredContests([...upcoming, ...past])
  }, [contests, selectedPlatforms])

  const toggleBookmark = (contestId: string) => {
    const updatedBookmarks = bookmarkedContests.includes(contestId)
      ? bookmarkedContests.filter((id) => id !== contestId)
      : [...bookmarkedContests, contestId]

    setBookmarkedContests(updatedBookmarks)
    localStorage.setItem("bookmarkedContests", JSON.stringify(updatedBookmarks))
  }

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms)
  }

  const now = new Date()
  const upcomingContests = filteredContests.filter((contest) => new Date(contest.start) > now)
  const pastContests = filteredContests.filter((contest) => new Date(contest.start) <= now)
  const bookmarked = filteredContests.filter((contest) => bookmarkedContests.includes(contest.id))

  return (
    <div className="mt-8 space-y-6">
      {/* Platform Filter */}
      <PlatformFilter selectedPlatforms={selectedPlatforms} contests={contests} onChange={handlePlatformChange}  />

      {/* Tabs for contest categories */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingContests.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastContests.length})</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked ({bookmarked.length})</TabsTrigger>
        </TabsList>

        {/* Upcoming Contests */}
        <TabsContent value="upcoming">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : upcomingContests.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} onBookmarkToggle={() => toggleBookmark(contest.id)} />
              ))}
            </div>
          ) : (
            <p>No upcoming contests</p>
          )}
        </TabsContent>

        {/* Past Contests */}
        <TabsContent value="past">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : pastContests.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} isPast onBookmarkToggle={() => toggleBookmark(contest.id)} />
              ))}
            </div>
          ) : (
            <p>No past contests</p>
          )}
        </TabsContent>

        {/* Bookmarked Contests */}
        <TabsContent value="bookmarked">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : bookmarked.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarked.map((contest) => (
                <ContestCard key={contest.id} contest={contest} isBookmarked onBookmarkToggle={() => toggleBookmark(contest.id)} />
              ))}
            </div>
          ) : (
            <p>No bookmarked contests</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
