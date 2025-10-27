import { Terminal, Monitor, Code, Sparkles, Bot, CheckCircle2, Zap } from "lucide-react"

export default function PlatformExamplesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Platform Examples</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Step-by-step examples for using Vibe Kit with Cursor, VS Code, Claude CLI, and other AI tools.
        </p>
      </div>

      <div className="space-y-6 pt-4">
        {/* Cursor */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Cursor</h2>
              <p className="text-sm text-muted-foreground">Automatic context loading</p>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 mb-4">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">✅ Zero Configuration Required</p>
            <p className="text-sm text-muted-foreground">
              Cursor automatically loads all Vibe Kit context files via <code className="rounded bg-muted px-1 font-mono text-xs">.cursor/rules/vibe-kit.mdc</code> for every AI prompt.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup (Already Done!)</h3>
              <p className="text-sm text-muted-foreground">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, Cursor automatically reads your context files.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Basic Usage</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Cursor AI chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  Create a login button using btn pattern
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Reference Commands</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Cursor AI chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  @.vibe-kit/commands/analyze.md
                </code>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
                <li><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/create-component.md</code></li>
                <li><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/run-tests.md</code></li>
                <li><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@.vibe-kit/commands/quality-check.md</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* VS Code */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">VS Code + GitHub Copilot</h2>
              <p className="text-sm text-muted-foreground">Use @ mentions in chat</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup</h3>
              <p className="text-sm text-muted-foreground mb-2">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, check <code className="rounded bg-muted px-1 font-mono text-xs">.vscode/VSCODE_USAGE.md</code> for details.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">⭐⭐ Best: Mention Entire Folder</h3>
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">In Copilot Chat</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm font-bold text-green-600 dark:text-green-400">
                  @.vibe-kit Create a login button
                </code>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  ✅ Includes ALL context files (standards, templates, commands) - No slash needed!
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Alternative: Mention Subfolders</h3>
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                    @.vibe-kit/standards Create a login button
                  </code>
                  <p className="text-xs text-muted-foreground mt-2 italic">Standards only (no templates)</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                    @.vibe-kit/standards/glossary.md @.vibe-kit/standards/code-style.md Create a login button
                  </code>
                  <p className="text-xs text-muted-foreground mt-2 italic">Specific files</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue.dev */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Continue.dev</h2>
              <p className="text-sm text-muted-foreground">Automatic context loading</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup</h3>
              <p className="text-sm text-muted-foreground">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, Continue.dev automatically loads context from <code className="rounded bg-muted px-1 font-mono text-xs">.continue/config.json</code>.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Usage</h3>
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
          </div>
        </div>

        {/* Aider */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Aider</h2>
              <p className="text-sm text-muted-foreground">Direct file references</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup</h3>
              <p className="text-sm text-muted-foreground">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, the <code className="rounded bg-muted px-1 font-mono text-xs">.aider/rules.md</code> file is configured.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Usage</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  aider "Create a login button. Follow .vibe-kit/standards/code-style.md"
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Using Vibe Kit Wrapper</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  export AI_TOOL=aider
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  vibe-kit ai "create a button component"
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Claude CLI */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Claude CLI</h2>
              <p className="text-sm text-muted-foreground">Direct file references</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup</h3>
              <p className="text-sm text-muted-foreground">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, reference <code className="rounded bg-muted px-1 font-mono text-xs">.vibe-kit</code> files directly.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Usage</h3>
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
              <h3 className="text-sm font-semibold mb-2">Using Vibe Kit Wrapper</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  export AI_TOOL=claude_cli
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  vibe-kit ai "create a button component"
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini CLI */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Google Gemini CLI</h2>
              <p className="text-sm text-muted-foreground">Direct file references</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Setup</h3>
              <p className="text-sm text-muted-foreground">
                After running <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit install</code>, reference <code className="rounded bg-muted px-1 font-mono text-xs">.vibe-kit</code> files directly.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Usage</h3>
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
              <h3 className="text-sm font-semibold mb-2">Using Vibe Kit Wrapper</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-mono">Terminal</span>
                </div>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  export AI_TOOL=gemini
                </code>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">
                  vibe-kit ai "create a button component"
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">✨ Auto-Detection</p>
            <p className="text-sm text-muted-foreground">
              Vibe Kit automatically detects which AI tools you have installed and configures integrations accordingly. Run <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit status</code> to see what's detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
