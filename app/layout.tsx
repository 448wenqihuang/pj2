import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lunchbox Beat Vault",
  description: "A shared vault for producers to upload and listen to beats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="glass-nav z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a
              href="/"
              className="font-semibold tracking-tight text-sm sm:text-base"
            >
              Lunchbox<span className="opacity-80"> Beat Vault</span>
            </a>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <a
                href="/"
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                Vault
              </a>
              <a
                href="/upload"
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition"
              >
                Upload
              </a>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 pt-24 pb-20 space-y-10">
          {children}
        </main>

        <footer className="glass-footer mt-8">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-slate-300/80">
            <span>Lunchbox Beat Vault</span>
            <span className="hidden sm:inline">
              Built as a persistent data experiment for DESN31927
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
