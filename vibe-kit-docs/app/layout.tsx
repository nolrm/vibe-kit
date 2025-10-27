import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vibe-kit-docs.vercel.app'),
  title: "Vibe Kit - Context Engineering for AI Development",
  description:
    "A comprehensive development toolkit that provides AI guidance, type safety, quality checks, and automated workflows for modern development teams.",
  generator: "next.js",
  keywords: ["AI development", "context engineering", "developer tools", "TypeScript", "code quality", "Cursor", "Claude", "Aider"],
  authors: [{ name: "Marlon Maniti", url: "https://github.com/nolrm" }],
  creator: "Marlon Maniti",
  publisher: "Vibe Kit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/nolrm/vibe-kit/tree/main/vibe-kit-docs",
    siteName: "Vibe Kit",
    title: "Vibe Kit - Context Engineering for AI Development",
    description: "Give your AI assistants structured context through markdown files. Vibe Kit creates a knowledge base that ensures AI generates code matching your exact patterns, style, and architecture.",
    images: [
      {
        url: "/vibe-kit-logo.svg",
        width: 1200,
        height: 630,
        alt: "Vibe Kit Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Kit - Context Engineering for AI Development",
    description: "Give your AI assistants structured context through markdown files.",
    creator: "@nolrm",
    images: ["/vibe-kit-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Vibe Kit",
              "description": "Context Engineering for AI Development - Give your AI assistants structured context through markdown files",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Marlon Maniti",
                "url": "https://github.com/nolrm"
              },
              "downloadUrl": "https://www.npmjs.com/package/@nolrm/vibe-kit",
              "softwareVersion": "1.0.0",
              "provider": {
                "@type": "Organization",
                "name": "Vibe Kit",
                "url": "https://github.com/nolrm/vibe-kit"
              }
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
