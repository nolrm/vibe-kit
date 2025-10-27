import { Terminal, CheckCircle2 } from "lucide-react"

export default function CommandsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Commands Reference</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Complete reference for all Vibe Kit CLI commands. You can use the short alias <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vk</code> instead of <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibe-kit</code>.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Install & Setup</h2>
        
        <div className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit install</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Install Vibe Kit in your current project. Creates <code className="rounded bg-muted px-1 font-mono text-xs">.vibe-kit/</code> directory and configures integrations.
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit install</code>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm font-medium mb-3">💡 Platform-Specific Installation</p>
            <p className="text-sm text-muted-foreground mb-3">
              If <code className="rounded bg-muted px-1 font-mono text-xs">.vibe-kit</code> already exists (e.g., installed by another team member), add your specific AI tool integration:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit cursor</code>
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit vscode</code>
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit claude</code>
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit gemini</code>
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit aider</code>
              <code className="block rounded bg-muted px-3 py-1 font-mono text-xs">vibe-kit continue</code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              These commands only add the integration files for your specific AI tool without affecting the existing <code className="rounded bg-muted px-0.5 font-mono text-xs">.vibe-kit/</code> directory.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit status</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Check installation status and verify which context files are loaded for AI prompts.
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit status</code>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  Shows which .md files will be loaded when you run <code className="rounded bg-muted px-1 font-mono text-xs">vk "prompt"</code>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit analyze</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Analyze your project and customize standards to match your tech stack, patterns, and preferences.
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit analyze</code>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>What it does:</strong> Scans project structure, detects patterns, and updates standards files to match your setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Updates & Maintenance</h2>
        
        <div className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit update</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Update Vibe Kit to the latest version.
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit update</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">AI Commands</h2>
        
        <div className="space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit &lt;prompt&gt;</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Chat with AI using Vibe Kit context. Just type your prompt directly!
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  vibe-kit "create a button component"
                </code>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  ✨ Shortcut: You can skip the "ai" keyword and just use <code className="rounded bg-muted px-1 font-mono text-xs">vk "your prompt"</code>
                </p>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 mt-2">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">💡 How it works:</p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                    <li>Automatically loads <code className="rounded bg-muted px-0.5 font-mono">.vibe-kit/CONTEXT.md</code></li>
                    <li>Includes all standards files (code-style, testing, architecture, guidelines)</li>
                    <li>Sends full context to your AI tool (Aider, Claude, Gemini)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">vibe-kit ai &lt;prompt&gt;</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Same as above, but with explicit "ai" keyword.
                </p>
                <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
                  vibe-kit ai "create a button component"
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Set your preferred AI tool with <code className="rounded bg-muted px-1 font-mono text-xs">export AI_TOOL=aider</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">AI Tool Commands</h2>
        
        <div className="rounded-lg border bg-card p-4 mb-4">
          <h3 className="font-semibold text-base mb-2">Cursor (Auto-loads)</h3>
          <p className="text-sm text-muted-foreground mb-2">
            All context files are automatically loaded. Reference specific commands in chat:
          </p>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">@.vibe-kit/commands/analyze.md</code>
        </div>

        <div className="rounded-lg border bg-card p-4 mb-4">
          <h3 className="font-semibold text-base mb-2">VS Code Copilot</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Use @ mentions to include context files in your prompts:
          </p>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">@.vibe-kit Create a login button</code>
          <p className="text-xs text-muted-foreground mt-2 italic">✅ One mention includes all context files</p>
        </div>

        <div className="rounded-lg border bg-card p-4 mb-4">
          <h3 className="font-semibold text-base mb-2">Claude / Gemini CLI</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Reference files directly in your prompts:
          </p>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">read .vibe-kit/standards/code-style.md</code>
        </div>

        <p className="text-muted-foreground leading-relaxed mt-4">
          When using Vibe Kit in AI tools, reference these files in your prompts:
        </p>

        <div className="grid gap-3 md:grid-cols-2 mt-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/analyze.md</h3>
            <p className="text-sm text-muted-foreground">
              Analyze and customize standards for your project
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/create-component.md</h3>
            <p className="text-sm text-muted-foreground">
              Create a new component following your patterns
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/create-feature.md</h3>
            <p className="text-sm text-muted-foreground">
              Create a new feature with all necessary files
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/run-tests.md</h3>
            <p className="text-sm text-muted-foreground">
              Run the test suite with coverage
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/quality-check.md</h3>
            <p className="text-sm text-muted-foreground">
              Run linting, type checking, and quality checks
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-base mb-1">@.vibe-kit/commands/add-documentation.md</h3>
            <p className="text-sm text-muted-foreground">
              Add documentation to your code
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-6">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Short Alias Available</p>
            <p className="text-sm text-muted-foreground">
              Use <code className="rounded bg-muted px-1 font-mono text-xs">vk</code> instead of <code className="rounded bg-muted px-1 font-mono text-xs">vibe-kit</code> for faster typing. Example: <code className="rounded bg-muted px-1 font-mono text-xs">vk install</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

