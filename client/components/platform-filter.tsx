"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"

interface Contest {
  id: string
  event: string
  start: string
  end: string
  duration: number
  platform: string // Updated: using platform instead of resource
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

  // Extract unique platforms from the API response
  useEffect(() => {
    if (!contests?.length) return

    const uniquePlatforms = Array.from(new Set(contests.map((contest) => contest.platform))) // Use contest.platform
      .map((platform) => ({
        value: platform.toLowerCase(),
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
      }))
      .filter(platform => platform.value)

    setPlatforms(uniquePlatforms)
  }, [contests])

  const togglePlatform = (platform: string) => {
    onChange(
      selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter((p) => p !== platform)
        : [...selectedPlatforms, platform]
    )
  }

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
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search platforms..." />
            <CommandList>
              <CommandEmpty>No platforms found.</CommandEmpty>
              <CommandGroup>
                {platforms.map((platform) => (
                  <CommandItem
                    key={platform.value}
                    onSelect={() => togglePlatform(platform.value)}
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedPlatforms.includes(platform.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </div>
                    <span>{platform.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
