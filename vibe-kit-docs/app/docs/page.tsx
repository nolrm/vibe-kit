import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">What is Vibe Kit?</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Vibe Kit is a <strong>Context Engineering toolkit</strong> designed for building fast, AI-assisted development
          workflows. It enriches AI assistants with structured markdown files containing your project's standards, code
          guides, and documentation.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm">
          Just want to try it out? Skip to the{" "}
          <Link href="/docs/quick-start" className="font-medium text-primary hover:underline">
            Quick Start
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">The Context Engineering Flow</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit works by providing structured context to AI assistants through markdown files. Here's how the flow
          works:
        </p>
        
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium mb-2">Example workflow:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Your Prompt:</strong> "Create a login button for customer app"</p>
            <p className="ml-4">↓</p>
            <p><strong>AI Reads Context Files:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code className="rounded bg-muted px-1 font-mono text-xs">glossary.md</code> → "customer" = apps/customer-app</li>
              <li><code className="rounded bg-muted px-1 font-mono text-xs">glossary.md</code> → "button" = Button component pattern</li>
              <li><code className="rounded bg-muted px-1 font-mono text-xs">code-style.md</code> → TypeScript strict mode</li>
              <li><code className="rounded bg-muted px-1 font-mono text-xs">testing.md</code> → Include numbered test cases</li>
            </ul>
            <p className="ml-4">↓</p>
            <p><strong>Context-Aware Code Generated</strong> matching YOUR patterns</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Use Cases</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Context Engineering</h3>
            <p className="text-muted-foreground leading-relaxed">
              Vibe Kit provides structured context to AI assistants through markdown files. By providing comprehensive
              context, you prevent AI hallucinations and get code that matches your exact patterns, style, and
              architecture. This is the core philosophy of Context Engineering - giving AI the right information to
              generate the right code.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Development Toolkit</h3>
            <p className="text-muted-foreground leading-relaxed">
              Beyond AI guidance, Vibe Kit includes type safety checks, quality assurance tools, automated Git hooks,
              and pre-configured standards. It's a complete toolkit for modern development teams who want to maintain
              consistency and quality across their codebase.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground leading-relaxed">
              With shared standards, templates, and automated workflows, Vibe Kit ensures your entire team follows the
              same patterns and best practices. Whether you're working with AI assistants or human developers, everyone
              has access to the same context and guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Developer Experience</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit aims to provide a great Developer Experience (DX) when working with AI-assisted development. It
          includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Intuitive CLI with helpful commands and clear output</li>
          <li>Comprehensive documentation and examples</li>
          <li>TypeScript support with full type safety</li>
          <li>Automated workflows that save time and reduce errors</li>
          <li>Flexible configuration to match your team's needs</li>
        </ul>
      </div>

      <div className="flex gap-4 pt-6">
        <Button asChild>
          <Link href="/docs/installation">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="https://github.com/nolrm/vibe-kit" target="_blank">
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>
  )
}
