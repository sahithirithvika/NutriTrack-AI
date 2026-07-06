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
      <body className="text-slate-900 dark:text-slate-100 flex h-screen overflow-hidden relative bg-slate-50 dark:bg-slate-950">
        {/* Global Glass Blur Wallpaper */}
        <div className="fixed inset-0 -z-20 bg-[url('/bg-wallpaper.png')] bg-cover bg-center opacity-80 dark:opacity-40"></div>
        <div className="fixed inset-0 -z-10 bg-white/40 dark:bg-slate-950/60 backdrop-blur-3xl"></div>
        
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
