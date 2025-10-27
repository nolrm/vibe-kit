export default function ProjectStructurePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Project Structure</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          After installation, Vibe Kit creates a comprehensive directory structure that provides context to AI
          assistants and organizes your development standards.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Directory Overview</h2>
        <p className="text-muted-foreground leading-relaxed">Vibe Kit creates two main directories in your project:</p>
        <div className="rounded-lg border bg-card p-6 my-6">
          <img
            src="/images/project-structure.png"
            alt="Vibe Kit project structure showing .vibe-kit and .cursor directories with their subdirectories and purposes"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">The .vibe-kit Directory</h2>
        <p className="text-muted-foreground leading-relaxed">
          This is the main directory where all your project standards and context files live:
        </p>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-lg mb-2">standards/</h3>
            <p className="text-sm text-muted-foreground mb-3">Standards that AI reads as context</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-mono">glossary.md</span>
                <span className="text-muted-foreground">- YOUR project shortcuts & terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-mono">code-style.md</span>
                <span className="text-muted-foreground">- YOUR coding conventions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-mono">testing.md</span>
                <span className="text-muted-foreground">- YOUR test patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-mono">architecture.md</span>
                <span className="text-muted-foreground">- YOUR architecture decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-mono">ai-guidelines.md</span>
                <span className="text-muted-foreground">- AI behavior rules</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-lg mb-2">commands/</h3>
            <p className="text-sm text-muted-foreground">AI workflow commands for common development tasks</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-lg mb-2">hooks/</h3>
            <p className="text-sm text-muted-foreground">Git hooks (optional) for automated quality checks</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-lg mb-2">types/</h3>
            <p className="text-sm text-muted-foreground">Type safety configs for TypeScript projects</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-lg mb-2">templates/</h3>
            <p className="text-sm text-muted-foreground">Code templates for consistent component generation</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">The .cursor/rules Directory</h2>
        <p className="text-muted-foreground leading-relaxed">For Cursor AI integration:</p>

        <div className="rounded-lg border bg-card p-4 mt-4">
          <h3 className="font-semibold text-lg mb-2">vibe-kit.mdc</h3>
          <p className="text-sm text-muted-foreground">
            Makes Cursor read the .md files from your standards directory, ensuring the AI assistant has full context of
            your project's conventions and patterns.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Customization</h2>
        <p className="text-muted-foreground leading-relaxed">
          All files in the .vibe-kit directory are meant to be customized for your project. Start with the defaults and
          modify them to match your team's specific needs:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
          <li>Add project-specific terminology to glossary.md</li>
          <li>Define your coding style preferences in code-style.md</li>
          <li>Document your testing approach in testing.md</li>
          <li>Capture architectural decisions in architecture.md</li>
          <li>Set AI behavior expectations in ai-guidelines.md</li>
        </ul>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-6">
        <p className="text-sm font-medium mb-2">Pro Tip</p>
        <p className="text-sm text-muted-foreground">
          The more detailed and specific your context files are, the better AI assistants will understand your project
          and generate code that matches your exact patterns and preferences.
        </p>
      </div>
    </div>
  )
}
