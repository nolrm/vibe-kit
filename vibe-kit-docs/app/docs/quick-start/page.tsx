import { Terminal, CheckCircle2 } from "lucide-react"

export default function QuickStartPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Quick Start</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Get up and running with Vibe Kit in your project in just a few steps.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          Install Vibe Kit
        </h2>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Install globally</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">npm install -g @nolrm/vibe-kit</code>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </span>
          Install in Your Project
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Navigate to your project directory and install Vibe Kit:
        </p>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Install in project</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">cd your-project</code>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm mt-2">vibe-kit install</code>
        </div>
        <p className="text-sm text-muted-foreground">
          This will create the necessary configuration files and directory structure in your project. You can also use the short alias <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vk install</code>.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            3
          </span>
          Customize Standards (Recommended)
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit will create a <code className="rounded bg-muted px-2 py-1 font-mono text-sm">.vibe-kit</code>{" "}
          directory with default standards and templates. Run the analyze command to customize them for your project:
        </p>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Analyze project</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit analyze</code>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-2">🎯 The analyze command will:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>Scan your project structure and dependencies</li>
            <li>Detect existing patterns and configurations</li>
            <li>Customize standards to match your tech stack</li>
            <li>Update guidelines based on your project type</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            4
          </span>
          Project Structure Created
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit creates the following structure in your project:
        </p>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium mb-2">Directory structure:</p>
          <pre className="rounded bg-muted p-3 font-mono text-xs overflow-x-auto">
            {`your-project/
├── .vibe-kit/
│   ├── standards/
│   │   ├── glossary.md          ← Project shortcuts & terminology
│   │   ├── code-style.md        ← Coding conventions
│   │   ├── testing.md           ← Test patterns
│   │   ├── architecture.md      ← Architecture decisions
│   │   └── ai-guidelines.md     ← AI behavior rules
│   ├── commands/
│   │   └── analyze.md           ← Analysis workflow
│   ├── templates/
│   │   └── component.tsx         ← Component template
│   └── types/
│
├── .cursor/rules/
│   └── vibe-kit.mdc             ← Makes AI read the .md files
├── .continue/
│   └── config.json               ← Continue.dev integration
└── .aider/
    └── rules.md                  ← Aider integration`}
          </pre>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          You're All Set!
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Vibe Kit is now configured in your project. Your AI assistants will have access to your standards and
          templates, ensuring consistent, high-quality code generation.
        </p>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-2">Next steps:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>Open Cursor and let AI read your context files automatically</li>
            <li>Start using AI prompts with your project shortcuts</li>
            <li>Try: "create @btn for customer checkout"</li>
            <li>Customize standards in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.vibe-kit/standards/</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
