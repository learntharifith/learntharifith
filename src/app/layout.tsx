import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learntharifith — Learn the Amazigh Riffian Language",
  description:
    "Free, structured video lessons to learn Tarifit — the Riffian Amazigh language. Phonetics, grammar, conversation and the culture of the Rif, taught with care.",
  keywords: [
    "Riffian",
    "Tarifit",
    "Amazigh",
    "Berber",
    "Learn Riffian",
    "Rif language",
    "Tifinagh",
    "Tamazight",
    "North Africa",
    "language learning",
  ],
  authors: [{ name: "Learntharifith" }],
  openGraph: {
    title: "Learntharifith — Learn the Amazigh Riffian Language",
    description:
      "Free, structured video lessons to learn Tarifit — the Riffian Amazigh language. Phonetics, grammar, conversation and the culture of the Rif.",
    siteName: "Learntharifith",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learntharifith — Learn the Amazigh Riffian Language",
    description:
      "Free, structured video lessons to learn Tarifit — the Riffian Amazigh language.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
