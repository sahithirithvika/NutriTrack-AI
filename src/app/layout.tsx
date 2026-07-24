import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriTrack AI Platform",
  description: "Ambient Health Intelligence",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`} suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden mesh-bg" style={{ color: "var(--foreground)" }}>
        
        <Toaster richColors position="top-right" />
        <AuthGuard>
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto bg-transparent">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}
