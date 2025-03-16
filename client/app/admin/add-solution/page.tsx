import { AddSolutionForm } from "@/components/admin/add-solution-form"

export default function AddSolutionPage() {
  return (
    <div className="w-full flex flex-col min-h-screen  justify-center items-center space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Solution</h1>
        <p className="text-muted-foreground mt-2">Upload a YouTube solution for a past contest</p>
      </div>
      <AddSolutionForm />
    </div>
  )
}

