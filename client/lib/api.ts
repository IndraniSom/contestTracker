import type { Contest } from "@/lib/types";

const API_URL = "https://clist.by/api/v1/contest/";
const API_KEY = process.env.NEXT_PUBLIC_CLIST_API_KEY; // Store in .env
const USERNAME = process.env.NEXT_PUBLIC_CLIST_USERNAME;

const RESOURCE_IDS = {
  codeforces: 1,
  codechef: 2,
  leetcode: 102,
};

// Function to fetch contests for a single platform
async function fetchContestsByPlatform(platform: keyof typeof RESOURCE_IDS): Promise<Contest[]> {
  try {
    const params = new URLSearchParams({
      username: USERNAME as string,
      api_key: API_KEY as string,
      resource__id: RESOURCE_IDS[platform].toString(),
      order_by: "-start", // Fetch past & future contests sorted by start date
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


// Fetch contests from all platforms
export async function fetchContests(): Promise<Contest[]> {
  try {
    const contestPromises = Object.keys(RESOURCE_IDS).map(async (platform) => {
      const contests = await fetchContestsByPlatform(platform as keyof typeof RESOURCE_IDS);
      return contests
        .map((contest: any) => {
          console.log(`Raw contest data:`, contest);

          let endDate: Date | null = null;

          if (contest.start && contest.duration) {
            endDate = new Date(new Date(contest.start).getTime() + contest.duration * 1000);
          } else {
            console.error(`Missing end date and cannot estimate for contest ID: ${contest.id}`, contest);
            return null;
          }

          if (!endDate || isNaN(endDate.getTime())) {
            console.error(`Invalid end date for contest ID: ${contest.id}`, contest.end);
            return null;
          }

          const startDate = new Date(endDate.getTime() - contest.duration * 1000);
          if (isNaN(startDate.getTime())) {
            console.error(`Invalid start date calculated for contest ID: ${contest.id}`, startDate);
            return null;
          }

          return {
            id: contest.id.toString(),
            event: contest.event,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            duration: contest.duration,
            platform: contest.platform,
            url: contest.url,
            icon: contest.icon,
          } as Contest;
        })
        .filter((contest): contest is Contest => contest !== null);
    });

    const allContests = await Promise.all(contestPromises);
    return allContests.flat();
  } catch (error) {
    console.error("Error fetching all contests:", error);
    return [];
  }
}
