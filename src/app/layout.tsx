import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudySlice AI - AI-Powered Video Clipping",
  description: "Transform your long-form videos into engaging, bite-sized clips with AI-powered precision.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`}>
        <Navigation />
        <main className="min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  );
}
