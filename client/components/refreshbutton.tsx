"use client"
import { useState } from "react";
import { fetchContests } from "@/lib/api"; // Update the import path
import { Contest } from "@/lib/types";

interface RefreshButtonProps {
  onRefresh: (contests: Contest[]) => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    const freshContests = await fetchContests(true); // Force refresh
    onRefresh(freshContests);
    setLoading(false);
  };

  return (
    <button
      onClick={handleRefresh}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Refreshing..." : "Refresh Contests"}
    </button>
  );
};

export default RefreshButton;
