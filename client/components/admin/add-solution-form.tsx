"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for past contests
const pastContests = [
  {
    id: "1",
    title: "Weekly Contest #123",
    date: "2023-01-15",
  },
  {
    id: "2",
    title: "Biweekly Contest #45",
    date: "2023-02-10",
  },
  {
    id: "3",
    title: "Special Holiday Contest",
    date: "2023-03-25",
  },
  {
    id: "4",
    title: "Algorithm Challenge #67",
    date: "2023-04-05",
  },
  {
    id: "5",
    title: "Data Structures Marathon",
    date: "2023-05-12",
  },
]

const formSchema = z.object({
  contestId: z.string({
    required_error: "Please select a contest",
  }),
  youtubeLink: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        // Basic YouTube URL validation
        return url.includes("youtube.com") || url.includes("youtu.be")
      },
      {
        message: "Please enter a valid YouTube URL",
      },
    ),
})

type FormValues = z.infer<typeof formSchema>

export function AddSolutionForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contestId: "",
      youtubeLink: "",
    },
  })

  function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log("Form values:", values)

      toast({
        title: "Solution added successfully",
        description: "The solution has been added to the contest",
      })

      // Reset form
      form.reset()
      setIsSubmitting(false)

      // In a real app, you would redirect to the admin dashboard
      // router.push("/admin/dashboard")
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contest</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a past contest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pastContests.map((contest) => (
                        <SelectItem key={contest.id} value={contest.id}>
                          {contest.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a past contest to add a solution for</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtubeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Solution Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Enter the YouTube URL for the solution video</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Solution"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

