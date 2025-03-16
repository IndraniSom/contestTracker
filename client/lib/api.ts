import type { Contest } from "@/lib/types";
import axios from "axios";
const API_URL = "https://clist.by/api/v1/contest/";
const API_KEY = process.env.NEXT_PUBLIC_CLIST_API_KEY; // Store in .env
const USERNAME = process.env.NEXT_PUBLIC_CLIST_USERNAME;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const RESOURCE_IDS = {
  codeforces: 1,
  codechef: 2,
  leetcode: 102,
};

// Function to fetch contests for a single platform
const CACHE_KEY = "contests_cache";
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchContestsByPlatform(platform: keyof typeof RESOURCE_IDS): Promise<Contest[]> {
  try {
    const params = new URLSearchParams({
      username: USERNAME as string,
      api_key: API_KEY as string,
      resource__id: RESOURCE_IDS[platform].toString(),
      order_by: "-start",
    });

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${platform} contests: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.objects.map((contest: any) => ({
      id: contest.id.toString(),
      event: contest.event,
      url: contest.href,
      platform: contest.resource.name.toLowerCase(),
      start: contest.start,
      duration: contest.duration,
    }));
  } catch (error) {
    console.error(`Error fetching ${platform} contests:`, error);
    return [];
  }
}

// Utility function to get cached contests
function getCachedContests(): Contest[] | null {
  const cache = localStorage.getItem(CACHE_KEY);
  if (!cache) return null;

  const { data, timestamp } = JSON.parse(cache);

  if (Date.now() - timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
}

// Utility function to cache contests
function cacheContests(contests: Contest[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: contests, timestamp: Date.now() }));
}

// Fetch contests from all platforms with caching
export async function fetchContests(forceRefresh = false): Promise<Contest[]> {
  try {
    if (!forceRefresh) {
      const cachedContests = getCachedContests();
      if (cachedContests) {
        console.log("Using cached contests data");
        return cachedContests;
      }
    }

    // Fetch from API if cache is expired or force refresh is true
    const contestPromises = Object.keys(RESOURCE_IDS).map(async (platform) => {
      return await fetchContestsByPlatform(platform as keyof typeof RESOURCE_IDS);
    });

    const allContests = (await Promise.all(contestPromises)).flat();

    // Cache new data
    cacheContests(allContests);

    return allContests;
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
}


export const getBookmarkedContests = async (token: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data; // Returns an array of bookmarked contest IDs
  } catch (error) {
    console.error("Error fetching bookmarked contests:", error);
    return [];
  }
};

// Add a contest to bookmarks
export const addBookmark = async (contestId: string, token: string) => {
  try {
    await axios.post(
      `${BACKEND_URL}/users/bookmarks`,
      { contestId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return false;
  }
};

// Remove a contest from bookmarks
export const removeBookmark = async (contestId: string, token: string) => {
  try {
    await axios.delete(`${BACKEND_URL}/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { contestId },
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }
};
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await axios.post(
      `${BACKEND_URL}/users/logout`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Remove token from storage
    localStorage.removeItem("token");

    return true; // Logout successful
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};