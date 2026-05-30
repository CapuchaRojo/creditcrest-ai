import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreditCrest AI",
  description: "Know the credit impact before you make the move.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#f6f8f5] text-[#06130f] antialiased">
        <header className="sticky top-0 z-30 border-b border-[#dce5dd] bg-[#f6f8f5]/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-black text-[#06130f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#06130f] text-emerald-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              CreditCrest AI
            </Link>
            <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-md border border-[#dce5dd] bg-white p-1 shadow-sm">
              <NavLink href="/simulator">Simulator</NavLink>
              <NavLink href="/plan">Plan</NavLink>
              <NavLink href="/scenarios">Scenarios</NavLink>
              <NavLink href="/methodology">Methodology</NavLink>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-[#dce5dd] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs leading-5 text-slate-600 sm:px-6 lg:px-8">
            CreditCrest AI is an educational hackathon MVP using synthetic demo
            data. It is not financial advice and does not calculate official
            credit scores.
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-[#eaf7ef] hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      {children}
    </Link>
  );
}
