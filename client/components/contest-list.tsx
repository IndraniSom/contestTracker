"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformFilter } from "@/components/platform-filter";
import { ContestCard } from "@/components/contest-card";
import type { Contest } from "@/lib/types";
import { fetchContests, getBookmarkedContests, addBookmark, removeBookmark } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ContestList() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("token"); 
    if (userToken) setToken(userToken);
  }, []);

  useEffect(() => {
    const loadContests = async () => {
      setLoading(true);
      try {
        const data = await fetchContests();
        setContests(data);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadBookmarkedContests = async () => {
      if (!token) return; // Exit if there's no token
    
      try {
        const bookmarksData = await getBookmarkedContests(token);
        console.log("Raw Bookmarks Data:", bookmarksData);
    
        // Extract bookmarks array correctly
        const bookmarks = Array.isArray(bookmarksData?.bookmarks) 
          ? bookmarksData.bookmarks 
          : Array.isArray(bookmarksData) 
          ? bookmarksData 
          : [];
    
        if (bookmarks.length > 0) {
          setBookmarkedContests(bookmarks);
        } else {
          console.warn("No valid bookmarks found.");
          setBookmarkedContests([]); // Prevents undefined state issues
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setBookmarkedContests([]); // Ensure state remains an empty array
      }
    };
    
    

    loadContests();
    if (token) loadBookmarkedContests();
  }, [token]);

  useEffect(() => {
    const now = new Date();
    const upcoming = contests.filter(
      (contest) => selectedPlatforms.includes(contest.platform) && new Date(contest.start) > now
    );
    const past = contests.filter(
      (contest) => selectedPlatforms.includes(contest.platform) && new Date(contest.start) <= now
    );
    setFilteredContests([...upcoming, ...past]);
  }, [contests, selectedPlatforms]);

  const toggleBookmark = async (contestId: string) => {
    if (!token) {
      setShowDialog(true);
      return;
    }

    try {
      if (bookmarkedContests.includes(contestId)) {
        await removeBookmark(contestId, token);
        setBookmarkedContests((prev) => prev.filter((id) => id !== contestId));
      } else {
        await addBookmark(contestId, token);
        setBookmarkedContests((prev) => [...prev, contestId]);
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  const now = new Date();
  const upcomingContests = filteredContests.filter((contest) => new Date(contest.start) > now);
  const pastContests = filteredContests.filter((contest) => new Date(contest.start) <= now);
  const bookmarked = filteredContests.filter((contest) => bookmarkedContests.includes(contest.id));

  return (
    <div className="mt-8 space-y-6">
      <PlatformFilter selectedPlatforms={selectedPlatforms} contests={contests} onChange={handlePlatformChange} />
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingContests.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastContests.length})</TabsTrigger>
          <TabsTrigger
            value="bookmarked"
            onClick={(e) => {
              if (!token) {
                e.preventDefault();
                setShowDialog(true);
              }
            }}
          >
            Bookmarked ({bookmarked.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : upcomingContests.length ? (
            <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isBookmarked={bookmarkedContests.includes(contest.id)}
                  onBookmarkToggle={() => toggleBookmark(contest.id)}
                />
              ))}
            </div>
          ) : (
            <p>No upcoming contests</p>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : pastContests.length ? (
            <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isPast
                  isBookmarked={bookmarkedContests.includes(contest.id)}
                  onBookmarkToggle={() => toggleBookmark(contest.id)}
                />
              ))}
            </div>
          ) : (
            <p>No past contests</p>
          )}
        </TabsContent>

        {token && (
          <TabsContent value="bookmarked">
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : bookmarked.length ? (
              <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarked.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isBookmarked
                    onBookmarkToggle={() => toggleBookmark(contest.id)}
                  />
                ))}
              </div>
            ) : (
              <p>No bookmarked contests</p>
            )}
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>Not Logged In</DialogTitle>
          <DialogDescription>You must be logged in to access bookmarks.</DialogDescription>
          <Button onClick={() => setShowDialog(false)}>OK</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
