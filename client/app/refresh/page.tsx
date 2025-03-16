"use client"
import { useState, useEffect } from "react";
import { fetchContests } from "@/lib/api";
import { Contest } from "@/lib/types";
import RefreshButton from "@/components/refreshbutton"; // Update path if needed

const ContestPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    fetchContests().then(setContests);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Contests</h1>

      <RefreshButton onRefresh={setContests} />

      <ul className="mt-4">
        {contests.length === 0 ? (
          <p>No contests available.</p>
        ) : (
          contests.map((contest) => (
            <li key={contest.id} className="p-2 border-b">
              <a href={contest.url} className="text-blue-600" target="_blank">
                {contest.event}
              </a> - {new Date(contest.start).toLocaleString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ContestPage;
