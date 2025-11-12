import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, FileCode, Zap, CheckCircle2, Sparkles } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Welcome to Vibe Kit</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Context-aware AI development. Give your AI assistants structured context through markdown files and get code that matches your exact patterns and conventions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">No AI Hallucinations</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AI has access to your actual standards, not generic patterns. It reads your real project structure and conventions.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Consistent Code</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Every suggestion follows your specific patterns. TypeScript config, component structure, testing approach—all matched to your codebase.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Project-Specific Guidance</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tailored to your tech stack and team preferences. Update the markdown files as your project evolves.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Living Documentation</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your standards evolve with your project. Document decisions once, reuse them across all AI interactions.
          </p>
        </div>
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
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Auto-Detection & Integration</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit automatically detects which AI tools you have installed and configures integrations accordingly:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4 mt-3">
          <code className="block text-sm font-mono mb-2">$ vibe-kit install</code>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>🎵 Installing Vibe Kit...</p>
            <p>✅ AI Tools detected: cursor, aider, claude_cli</p>
            <p>✅ Cursor integration installed</p>
            <p>✅ Aider integration installed</p>
            <p>✅ CLI helpers installed</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Use Cases</h2>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
            <Brain className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Context Engineering</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Structure AI context through markdown files. Give AI assistants the right information to generate code that matches your patterns.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
            <FileCode className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Development Toolkit</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete toolkit for teams: type safety, quality checks, Git hooks, and standards. Maintain consistency across your codebase.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
            <Zap className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Shared standards, templates, and workflows ensure everyone follows the same patterns and best practices.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Enterprise Features</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit includes enterprise-grade features for larger teams and complex projects:
        </p>
        <div className="grid gap-3 md:grid-cols-2 mt-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">Policy Enforcement</h3>
            <p className="text-sm text-muted-foreground">
              Configure and enforce coding standards with <code className="rounded bg-muted px-1 font-mono text-xs">vk check</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">Workflow Orchestration</h3>
            <p className="text-sm text-muted-foreground">
              Execute structured workflows with <code className="rounded bg-muted px-1 font-mono text-xs">vk run</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">Registry & Versioning</h3>
            <p className="text-sm text-muted-foreground">
              Share standards across teams with <code className="rounded bg-muted px-1 font-mono text-xs">vk publish/pull</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">Observability</h3>
            <p className="text-sm text-muted-foreground">
              Monitor standards health with <code className="rounded bg-muted px-1 font-mono text-xs">vk dashboard</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 md:col-span-2">
            <h3 className="font-semibold text-base mb-1">Monorepo Support</h3>
            <p className="text-sm text-muted-foreground">
              Automatic detection and separate analysis for frontend/backend packages. Works with Turborepo, Nx, Lerna, and workspaces.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Link href="/docs/enterprise-features" className="text-sm text-primary hover:underline font-medium">
            Learn more about Enterprise Features →
          </Link>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Context Files</h2>
        <p className="text-muted-foreground leading-relaxed">
          These markdown files provide context to your AI assistant:
        </p>
        <div className="grid gap-3 md:grid-cols-2 mt-3">
          <div className="rounded-lg border bg-card p-4">
            <code className="text-sm font-mono mb-1">glossary.md</code>
            <p className="text-sm text-muted-foreground">
              Project terminology and business terms (e.g., checkout, customer, order)
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <code className="text-sm font-mono mb-1">code-style.md</code>
            <p className="text-sm text-muted-foreground">
              Your coding conventions and style preferences
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <code className="text-sm font-mono mb-1">testing.md</code>
            <p className="text-sm text-muted-foreground">
              Testing patterns and expectations
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <code className="text-sm font-mono mb-1">architecture.md</code>
            <p className="text-sm text-muted-foreground">
              Architecture decisions and patterns
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 md:col-span-2">
            <code className="text-sm font-mono mb-1">ai-guidelines.md</code>
            <p className="text-sm text-muted-foreground">
              AI behavior rules and best practices for AI interactions
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Developer Experience</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit is designed for a great Developer Experience when working with AI-assisted development:
        </p>
        <div className="grid gap-3 md:grid-cols-2 mt-3">
          <div className="rounded-lg border bg-muted/30 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Intuitive CLI</p>
              <p className="text-xs text-muted-foreground">Clear commands with helpful output</p>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">TypeScript Support</p>
              <p className="text-xs text-muted-foreground">Full type safety throughout</p>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Automated Workflows</p>
              <p className="text-xs text-muted-foreground">Saves time and reduces errors</p>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Flexible Configuration</p>
              <p className="text-xs text-muted-foreground">Match your team's needs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button asChild>
          <Link href="/docs/quick-start">
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
