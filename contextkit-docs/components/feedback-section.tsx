"use client"

import { Github, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeedbackSection({ page }: { page: string }) {
  const handleFeedback = () => {
    const url = `https://github.com/nolrm/contextkit/issues/new?title=Docs%20Feedback&body=Page:%20${page}%0A%0AFeedback:%20`
    window.open(url, '_blank')
  }

  return (
    <div className="border-t mt-12 pt-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Was this helpful?</h3>
          <p className="text-sm text-muted-foreground">
            Help us improve the documentation by sharing your feedback.
          </p>
        </div>
        <Button variant="outline" onClick={handleFeedback}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Give Feedback
        </Button>
      </div>
    </div>
  )
}
