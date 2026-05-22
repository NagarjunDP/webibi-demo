import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const syne = Syne({ 
  subsets: ["latin"], 
  weight: ["800"],
  variable: "--font-syne" 
});

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans" 
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: "demo.webibi.tech | Your Website in 60 seconds",
  description: "AI-powered website demo generator for Webibi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          dmSans.variable,
          syne.variable,
          jetbrainsMono.variable
        )}
      >
        <main className="max-w-[480px] mx-auto min-h-screen relative overflow-x-hidden border-x border-white/5 bg-[#0a0a0f] shadow-2xl">
          {children}
        </main>
      </body>
    </html>
  );
}
