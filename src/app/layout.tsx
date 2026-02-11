import type { Metadata } from "next";
import Link from "next/link";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "ロールプレイ型AIチャットボット",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <ToastProvider>
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
              <Link href="/" className="text-lg font-bold text-gray-900">
                AI Chat
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link
                  href="/characters"
                  className="text-gray-600 hover:text-gray-900"
                >
                  キャラクター
                </Link>
                <Link
                  href="/chat"
                  className="text-gray-600 hover:text-gray-900"
                >
                  チャット
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
