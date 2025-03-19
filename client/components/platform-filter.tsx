"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"

interface Contest {
  id: string
  event: string
  start: string
  end: string
  duration: number
  platform: string
  url: string
  icon?: string
}

interface PlatformFilterProps {
  selectedPlatforms: string[]
  contests?: Contest[]
  onChange: (platforms: string[]) => void
}

export function PlatformFilter({ selectedPlatforms, contests = [], onChange }: PlatformFilterProps) {
  const [open, setOpen] = useState(false)
  const [platforms, setPlatforms] = useState<{ value: string; label: string }[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!contests?.length) return

    const uniquePlatforms = Array.from(new Set(contests.map((contest) => contest.platform)))
      .map((platform) => ({
        value: platform.toLowerCase(),
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
      }))
      .filter(platform => platform.value)

    setPlatforms(uniquePlatforms)
  }, [contests])

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length === 1) return;
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  }

  useEffect(() => {
    if (platforms.length > 0 && selectedPlatforms.length === 0) {
      onChange([platforms[2].value]);
    }
  }, [platforms, selectedPlatforms, onChange])

  const filteredPlatforms = platforms.filter((platform) =>
    platform.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm font-medium">Filter by:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {selectedPlatforms.length > 0
              ? `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""} selected`
              : "Select platforms"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-64">
          <input
            type="text"
            placeholder="Search platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary"
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {filteredPlatforms.length > 0 ? (
              filteredPlatforms.map((platform) => (
                <div
                  key={platform.value}
                  onClick={() => togglePlatform(platform.value)}
                  className="flex items-center px-2 py-2 cursor-pointer rounded-md"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedPlatforms.includes(platform.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {selectedPlatforms.includes(platform.value) && <CheckIcon className="h-3 w-3" />}
                  </div>
                  <span>{platform.label}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 p-2">No platforms found.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}