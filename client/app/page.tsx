import ContestList from "@/components/contest-list"
import type { Metadata } from "next"
import Allcontest from "@/components/allcontest"
export const metadata: Metadata = {
  title: "Contest Tracker - Track Coding Competitions",
  description: "Track upcoming and past coding contests from Codeforces, CodeChef, and LeetCode",
}

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col justify-center px-10 ">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contest Tracker</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Track upcoming coding contests from Codeforces, CodeChef, and LeetCode
        </p>
      </div>
      <ContestList />
      {/* <Allcontest/> */}
    </main>
  )
}

