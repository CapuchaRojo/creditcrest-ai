import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  ClipboardList,
  FlaskConical,
  Home,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
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
      <body className="min-h-full bg-[#f6f8f5] pb-24 text-[#06130f] antialiased sm:pb-0">
        <header className="sticky top-0 z-30 border-b border-[#dce5dd] bg-white shadow-sm">
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
            <div className="hidden min-w-0 items-center gap-1 overflow-x-auto rounded-md border border-[#dce5dd] bg-[#f8faf8] p-1 sm:flex">
              <NavLink href="/simulator">Simulator</NavLink>
              <NavLink href="/lending-lab">Lending Lab</NavLink>
              <NavLink href="/calculator-hub">Calculators</NavLink>
              <NavLink href="/onboarding">Snapshot</NavLink>
              <NavLink href="/plan">Plan</NavLink>
              <NavLink href="/scenarios">Scenarios</NavLink>
              <NavLink href="/methodology">Methodology</NavLink>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-[#dce5dd] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs leading-5 text-slate-600 sm:px-6 lg:px-8">
            <p>
              CreditCrest AI is an educational prototype using synthetic demo
              data. It is not financial advice and does not calculate official
              credit scores.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-bold">
              <Link
                href="/privacy"
                className="text-slate-700 transition hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Privacy
              </Link>
              <Link
                href="/disclaimer"
                className="text-slate-700 transition hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Disclaimer
              </Link>
              <a
                href="https://github.com/CapuchaRojo/creditcrest-ai"
                className="text-slate-700 transition hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                GitHub
              </a>
              <Link
                href="/lending-lab"
                className="text-slate-700 transition hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                CrestLend ecosystem
              </Link>
            </div>
          </div>
        </footer>
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dce5dd] bg-white px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(6,19,15,0.08)] sm:hidden"
        >
          <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
            <MobileNavLink href="/" icon={Home} label="Home" />
            <MobileNavLink
              href="/simulator?scenario=buy-laptop"
              icon={SlidersHorizontal}
              label="Sim"
            />
            <MobileNavLink href="/lending-lab" icon={FlaskConical} label="Lab" />
            <MobileNavLink
              href="/calculator-hub"
              icon={Calculator}
              label="Calc"
            />
            <MobileNavLink href="/plan" icon={ClipboardList} label="Plan" />
            <MobileNavLink href="/methodology" icon={ShieldCheck} label="Rules" />
          </div>
        </nav>
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

function MobileNavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-2 text-[11px] font-bold text-slate-700 transition hover:bg-[#eaf7ef] hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
