"use client"
import { useEffect, useState } from "react";
import { fetchContests } from "@/lib/api";

interface Contest {
  id: string;
  event: string;
  start: string;
  end: string;
  duration: number;
  platform: string;
  url: string;
  icon?: string;
}

const RESOURCE_IDS = {
  codeforces: "Codeforces",
  codechef: "CodeChef",
  leetcode: "LeetCode",
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    Object.keys(RESOURCE_IDS)
  );

  useEffect(() => {
    async function loadContests() {
      const fetchedContests = await fetchContests();
      setContests(fetchedContests);
    }
    loadContests();
  }, []);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const filteredContests = contests.filter((contest) =>
    selectedPlatforms.includes(contest.platform.toLowerCase())
  );

  const upcomingContests = filteredContests.filter(
    (contest) => new Date(contest.start) > new Date()
  );

  const pastContests = filteredContests.filter(
    (contest) => new Date(contest.end) < new Date()
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contests</h1>
      <div className="flex gap-4 mb-4">
        {Object.entries(RESOURCE_IDS).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes(key)}
              onChange={() => togglePlatform(key)}
            />
            {label}
          </label>
        ))}
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming Contests</h2>
        <ul>
          {upcomingContests.length > 0 ? (
            upcomingContests.map((contest) => (
              <li key={contest.id} className="border p-2 rounded mb-2">
                <a href={contest.url} target="_blank" className="font-medium">
                  {contest.event}
                </a>
                <p>Start: {new Date(contest.start).toLocaleString()}</p>
                <p>Platform: {contest.platform}</p>
              </li>
            ))
          ) : (
            <p>No upcoming contests.</p>
          )}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Past Contests</h2>
        <ul>
          {pastContests.length > 0 ? (
            pastContests.map((contest) => (
              <li key={contest.id} className="border p-2 rounded mb-2">
                <a href={contest.url} target="_blank" className="font-medium">
                  {contest.event}
                </a>
                <p>End: {new Date(contest.end).toLocaleString()}</p>
                <p>Platform: {contest.platform}</p>
              </li>
            ))
          ) : (
            <p>No past contests.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
