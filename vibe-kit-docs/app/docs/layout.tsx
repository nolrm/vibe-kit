import type React from "react"
import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsHeader } from "@/components/docs-header"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DocsHeader />
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <DocsSidebar />
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">{children}</div>
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-4">
              <div className="space-y-2">
                <p className="font-medium">On this page</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
