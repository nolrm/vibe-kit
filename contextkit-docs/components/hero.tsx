import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center gap-8 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Terminal className="mr-2 h-3 w-3" />
            Context Engineering for AI Development
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            ContextKit
          </h1>

          <p className="text-balance text-xl text-muted-foreground sm:text-2xl md:text-3xl max-w-3xl">
            Give your AI assistants structured context through markdown files
          </p>

          <p className="text-balance text-base text-muted-foreground max-w-2xl leading-relaxed mt-2">
            Create a knowledge base that ensures AI generates code matching your exact patterns, style, and architecture. Works with Cursor, VS Code, Claude CLI, and more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button size="lg" asChild className="text-base">
            <Link href="/docs">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
            <Link href="/docs/quick-start">Quick Start</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
            <Link href="https://github.com/nolrm/contextkit" target="_blank">
              GitHub
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Install via npm</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">npm install -g @nolrm/contextkit</code>
        </div>
      </div>
    </section>
  )
}
