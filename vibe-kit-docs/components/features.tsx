import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, Zap, FileCode, GitBranch, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Context Engineering",
    description:
      "Provide structured markdown context to AI assistants, preventing hallucinations and ensuring code matches your exact patterns and architecture.",
  },
  {
    icon: Shield,
    title: "Type Safety & Quality",
    description:
      "Built-in TypeScript support with comprehensive type checking, linting, and quality assurance tools to maintain code excellence.",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Streamline your development process with automated Git hooks, pre-commit checks, and continuous integration workflows.",
  },
  {
    icon: FileCode,
    title: "Standards & Templates",
    description:
      "Pre-configured coding standards, project templates, and best practices to kickstart your development with consistency.",
  },
  {
    icon: GitBranch,
    title: "Git Integration",
    description:
      "Seamless Git workflow integration with automated hooks, commit message validation, and branch management tools.",
  },
  {
    icon: Sparkles,
    title: "Developer Experience",
    description:
      "Optimized for modern development teams with intuitive CLI, comprehensive documentation, and excellent tooling support.",
  },
]

export function Features() {
  return (
    <section className="container mx-auto py-24 md:py-32">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything You Need
          </h2>
          <p className="text-balance text-lg text-muted-foreground max-w-2xl">
            Vibe Kit provides a complete toolkit for modern development teams, combining AI guidance with robust quality
            checks and automated workflows.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
