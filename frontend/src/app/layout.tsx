import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SumUp",
  description: "Notionライクなノートアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <SettingsProvider>
          <Header />
          <TabNav />
          <main className="flex-1">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
