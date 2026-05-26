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
  title: 'Webibi — Your Business Website in 20 Seconds',
  description: 'Upload your logo. AI builds a stunning demo website instantly. Free. No tech skills needed.',
  openGraph: {
    title: 'Webibi — Your Business Website in 20 Seconds',
    description: 'Upload your logo. AI builds your website in 20 seconds. Free demo for every business.',
    url: 'https://demo.webibi.tech',
    siteName: 'Webibi',
    images: [
      {
        url: 'https://demo.webibi.tech/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Webibi — Your Business Website in 20 Seconds',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webibi — Your Business Website in 20 Seconds',
    description: 'Upload your logo. AI builds your website in 20 seconds.',
    images: ['https://demo.webibi.tech/og-default.png'],
  },
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
        <main className="max-w-[480px] mx-auto min-h-screen relative overflow-x-hidden bg-[#080808]">
          {children}
        </main>
      </body>
    </html>
  );
}
