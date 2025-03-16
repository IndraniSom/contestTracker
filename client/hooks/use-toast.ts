"use client"

import { toast as sonnerToast, type ToastT } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description?: string; type?: ToastT }) => {
      sonnerToast(title, {
        description,
        
      })
    },
  }
}
