import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy | CreditCrest AI",
  description:
    "How CreditCrest AI handles synthetic data, local-only snapshots, and privacy-safe educational simulations.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Privacy overview
        </div>
        <h1 className="mt-5 text-4xl font-black text-[#06130f] sm:text-5xl">
          Privacy at CreditCrest AI
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          CreditCrest AI is an educational prototype. It uses synthetic demo
          data by default and keeps optional Financial Snapshot inputs stored
          only in your browser.
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Last updated: May 31, 2026
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PrivacyPrinciple
            title="Synthetic by default"
            body="Maya, scenarios, and Lending Lab offers are demo examples for education and testing."
          />
          <PrivacyPrinciple
            title="Local where applicable"
            body="Financial Snapshot and checklist progress use browser localStorage instead of a backend database."
          />
          <PrivacyPrinciple
            title="No data sale"
            body="CreditCrest AI does not sell user data or share local demo inputs with lenders, banks, or bureaus."
          />
        </div>

        <PolicySection title="What The App Uses">
          <p>
            CreditCrest AI uses synthetic profiles, synthetic scenarios,
            educational calculator inputs, and optional local-only Financial
            Snapshot values such as a nickname, rounded income estimate, debt
            obligations, card balance, card limit, inquiry count, missed-payment
            range, account age, and primary goal.
          </p>
          <p>
            When local storage applies, data stays on the device and browser
            where it was entered. The current app does not send Financial
            Snapshot data to a backend service.
          </p>
        </PolicySection>

        <PolicySection title="What The App Does Not Collect">
          <Checklist
            items={[
              "Social Security numbers",
              "Full dates of birth",
              "Bank credentials",
              "Credit bureau credentials",
              "Real identity documents",
              "Real uploaded files",
              "Account numbers",
              "Real loan applications",
              "Real credit bureau data",
              "Real bank transaction data",
            ]}
          />
        </PolicySection>

        <PolicySection title="Lending And Credit Boundaries">
          <p>
            CreditCrest AI and the CrestLend learning experience do not approve
            or deny real users, match users with real lenders, show real lender
            offers, or submit data to banks, credit bureaus, lenders, or
            document providers.
          </p>
          <p>
            The app does not calculate official credit scores and does not
            guarantee credit, lending, approval, or financial outcomes.
          </p>
        </PolicySection>

        <PolicySection title="Your Controls">
          <Checklist
            items={[
              "Use the Maya demo profile without creating a snapshot",
              "Create an optional local Financial Snapshot",
              "Delete the Financial Snapshot from the onboarding page",
              "Avoid entering sensitive identifiers because the app does not need them",
            ]}
          />
        </PolicySection>

        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-lg font-black text-[#06130f]">
                Production note
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-950">
                If CreditCrest AI later adds backend services, analytics,
                partner integrations, identity verification, document upload,
                credit bureau soft pulls, open banking, payment processing, or
                retention rules, this privacy overview must be reviewed and
                updated before release.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/disclaimer"
            className="inline-flex items-center justify-center rounded-md bg-[#06130f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Read the disclaimer
          </Link>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-[#06130f]">{title}</h2>
      <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </section>
  );
}

function PrivacyPrinciple({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-[#06130f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-[#dce5dd] bg-[#f8faf8] px-3 py-2 font-semibold text-slate-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
