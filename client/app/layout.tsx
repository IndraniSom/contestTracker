import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeTracker",
  description: "Track coding contests from popular platforms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Header /> {/* Move Header to its own client component */}
              <main>{children}</main>
            </div>
            </AuthProvider>
          </ThemeProvider>
        
      </body>
    </html>
  );
}
