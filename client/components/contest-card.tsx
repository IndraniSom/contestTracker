import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Clock } from "lucide-react"
import type { Contest } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

interface ContestCardProps {
  contest: Contest
  isBookmarked: boolean
  onBookmarkToggle: () => void
  isPast?: boolean
}

export function ContestCard({ contest, isBookmarked, onBookmarkToggle, isPast = false }: ContestCardProps) {
  const [timeRemaining, setTimeRemaining] = useState("")
  const [solutionLink, setSolutionLink] = useState<string | null>(null)

  useEffect(() => {
    if (isPast) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const start = new Date(contest.start)

      if (start <= now) {
        setTimeRemaining("Started")
        return
      }

      setTimeRemaining(formatDistanceToNow(start, { addSuffix: true }))
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [contest.start, isPast])

  useEffect(() => {
    const normalizeTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\(div\.\s*(\d+)\)/gi, "(div $1)") // Convert "(Div. 3)" → "(Div 3)"
    .replace(/\(.*?\)/g, "") // Remove everything inside parentheses (for CodeChef)
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Remove leading and trailing spaces
};
    const fetchSolutionVideo = async () => {
      try {
        let playlistId: string | null = null

        if (contest.platform === "leetcode.com") {
          playlistId = 'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr' // Replace with actual Leetcode playlist ID
        } else if (contest.platform === "codeforces.com") {
          playlistId = 'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB' // Replace with actual Codeforces playlist ID
        } else if (contest.platform === "codechef.com") {
          playlistId = 'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr' // Replace with actual Codechef playlist ID
        }

        if (!playlistId) return

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
        )
        const data = await response.json()

        if (!data.items) return

        // Match contest event with video title
        const matchedVideo = data.items.find((video: any) => {
          let videoTitle = video.snippet.title.toLowerCase();
          let contestTitle = contest.event.toLowerCase();
        
          // Adjust contest title format based on platform
          if (contest.platform === "leetcode.com") {
            contestTitle = `leetcode ${contestTitle}`;
          } else if (contest.platform === "codeforces.com") {
            videoTitle=normalizeTitle(videoTitle);
            contestTitle=normalizeTitle(contestTitle);
          } else if (contest.platform === "codechef.com") {
            contestTitle = contestTitle.replace(/\(.*?\)/g, "").trim();
            contestTitle = `codechef ${contestTitle}`;
          }
        
          return videoTitle.includes(contestTitle);
        });
        
        
        if (matchedVideo) {
          setSolutionLink(`https://www.youtube.com/watch?v=${matchedVideo.snippet.resourceId.videoId}`)
        }
      } catch (error) {
        console.error("Failed to fetch YouTube video:", error)
      }
    }

    fetchSolutionVideo()
  }, [contest.event, contest.platform]) // Re-run whenever contest.event or contest.platform changes

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "codeforces.com":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "codechef.com":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "leetcode.com":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${getPlatformColor(contest.platform)}`}>{contest.platform}</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onBookmarkToggle}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{contest.event}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{format(new Date(contest.start), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
          {!isPast && <div className="text-sm font-medium">{timeRemaining}</div>}
          {contest.duration && (
            <div className="text-sm text-muted-foreground">Duration: {Math.round(contest.duration / 60)} minutes</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={contest.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {isPast ? "View Results" : "Visit Contest"}
          </a>
        </Button>
        {isPast && solutionLink && (
  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
    <a href={solutionLink} target="_blank" rel="noopener noreferrer">
      <ExternalLink className="mr-2 h-4 w-4" />
      View Solution
    </a>
  </Button>
)}

      </CardFooter>
    </Card>
  )
}
