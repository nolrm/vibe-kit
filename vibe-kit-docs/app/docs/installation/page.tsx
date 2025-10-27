import { Terminal } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Installation</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Get started with Vibe Kit in minutes. Install globally via npm and start using it in your projects.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Prerequisites</h2>
        <p className="text-muted-foreground leading-relaxed">Before installing Vibe Kit, make sure you have:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Node.js 16.x or higher</li>
          <li>npm or yarn package manager</li>
          <li>Git installed and configured</li>
        </ul>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Global Installation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Install Vibe Kit globally to use it across all your projects:
        </p>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">npm</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">npm install -g @nolrm/vibe-kit</code>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Verify Installation</h2>
        <p className="text-muted-foreground leading-relaxed">
          After installation, verify that Vibe Kit is installed correctly:
        </p>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Check version</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">vibe-kit --version</code>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Alternative Installation</h2>
        <p className="text-muted-foreground leading-relaxed">
          For users without Node.js, you can use the fallback installation method:
        </p>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Terminal className="h-4 w-4" />
            <span className="font-mono">Fallback install</span>
          </div>
          <code className="block rounded bg-muted px-4 py-2 font-mono text-sm">
            curl -sSL https://raw.githubusercontent.com/nolrm/vibe-kit/main/install-fallback.sh | bash
          </code>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p className="text-muted-foreground leading-relaxed">Now that you have Vibe Kit installed, you can:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Install Vibe Kit in your project directory with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibe-kit install</code></li>
          <li>Run <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibe-kit analyze</code> to customize standards</li>
          <li>Customize your standards in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.vibe-kit/standards/</code></li>
          <li>Start using AI-assisted development with proper context</li>
        </ul>
      </div>
    </div>
  )
}
