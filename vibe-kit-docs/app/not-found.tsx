import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">
              <Search className="mr-2 h-4 w-4" />
              Browse Docs
            </Link>
          </Button>
        </div>

        <div className="pt-8 space-y-2 text-sm text-muted-foreground">
          <p>Common pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/docs/quick-start" className="underline">Quick Start</Link>
            <span>•</span>
            <Link href="/docs/platform-examples" className="underline">Platform Examples</Link>
            <span>•</span>
            <Link href="/docs/commands" className="underline">Commands</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
