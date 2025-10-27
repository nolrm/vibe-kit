import { Terminal, Monitor, Code, Sparkles, Bot } from "lucide-react"

export default function PlatformExamplesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Platform Examples</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Vibe Kit works seamlessly across multiple AI development platforms. See examples for each platform below.
        </p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Cursor</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            In Cursor IDE, your context files are automatically loaded via the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.cursor/rules/vibe-kit.mdc</code> file.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Cursor AI chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  Create a login button component using @btn pattern
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Analyze project:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Cursor AI chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  @.vibe-kit/commands/analyze.md
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Use commands:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/create-component.md</code> - Create component
                </li>
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/run-tests.md</code> - Run tests
                </li>
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/quality-check.md</code> - Quality check
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Continue.dev</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            Continue.dev automatically loads context from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.continue/config.json</code>.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Continue chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  Read .vibe-kit/commands/analyze.md and execute the analysis
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Standard file reference:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Continue chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  @.vibe-kit/standards/glossary.md
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  @.vibe-kit/standards/code-style.md
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aider</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            Aider automatically reads <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.aider/rules.md</code> for context.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  aider "read .vibe-kit/commands/analyze.md and execute"
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Create components:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  aider "create a user dashboard component following our standards"
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Claude CLI</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            Use Vibe Kit with Claude CLI for command-line AI assistance.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  claude "read .vibe-kit/commands/analyze.md and execute"
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Using Vibe Kit wrapper:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  vibe-kit ai "create a login form with validation"
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  vk ai "create a login form with validation"
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Google Gemini CLI</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            Use Vibe Kit with Google Gemini CLI for AI assistance.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  gemini "read .vibe-kit/commands/analyze.md and execute"
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Using Vibe Kit wrapper:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  export AI_TOOL=gemini
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  vk ai "create a button component"
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">VS Code + GitHub Copilot</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            Use Vibe Kit context files with VS Code and GitHub Copilot.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Example usage:</p>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Copilot Chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  Use: @.vibe-kit/commands/analyze.md to analyze this project
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Reference standards:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/standards/glossary.md</code> - Project shortcuts
                </li>
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/standards/code-style.md</code> - Code style
                </li>
                <li>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/standards/testing.md</code> - Testing patterns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-6">
        <p className="text-sm font-medium mb-2">✨ Auto-Detection</p>
        <p className="text-sm text-muted-foreground">
          Vibe Kit automatically detects which AI tools you have installed and configures integrations accordingly. No manual setup required!
        </p>
      </div>
    </div>
  )
}

