import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | CreditCrest AI",
  description:
    "Important educational, credit, lending, and outcome limitations for CreditCrest AI.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-amber-200 bg-white px-3 py-1 text-xs font-black text-amber-800 shadow-sm">
          <Scale className="h-4 w-4" aria-hidden="true" />
          Educational disclaimer
        </div>
        <h1 className="mt-5 text-4xl font-black text-[#06130f] sm:text-5xl">
          Important limitations
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          CreditCrest AI and the CrestLend learning experience are educational
          simulation tools. They are designed to help people understand credit
          and borrowing tradeoffs before acting.
        </p>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-lg font-black text-[#06130f]">
                Use for education only
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-950">
                The app does not replace advice from qualified financial,
                legal, tax, credit, or lending professionals.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DisclaimerCard
            title="Not financial or legal advice"
            body="CreditCrest AI does not provide financial advice, legal advice, lending advice, tax advice, or a substitute for professional guidance."
          />
          <DisclaimerCard
            title="Not credit repair"
            body="The app is not a credit repair organization. It does not dispute credit report items or promise credit-file changes."
          />
          <DisclaimerCard
            title="Not a lender"
            body="CreditCrest AI and CrestLend are not lenders, brokers, credit bureaus, banks, loan servicers, or real lender marketplaces."
          />
          <DisclaimerCard
            title="No real underwriting"
            body="The app does not provide real lender offers, real loan applications, real underwriting, approval, denial, or lender matching."
          />
          <DisclaimerCard
            title="No official score calculation"
            body="CreditCrest AI does not calculate official credit scores, FICO scores, VantageScore scores, bureau-specific scores, or exact score-point changes."
          />
          <DisclaimerCard
            title="No guaranteed outcomes"
            body="The app does not guarantee approval, funding, rates, repayment terms, credit outcomes, score changes, or financial outcomes."
          />
        </div>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            About simulated results
          </h2>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-600">
            <p>
              Any credit or loan impact language is directional and educational
              only. Risk labels, approval-readiness labels, recommendations,
              calculator results, timelines, and education unlocks come from
              simplified deterministic rules.
            </p>
            <p>
              CrestLend uses synthetic offers and simulated applications only.
              The offers are not real products and do not represent available
              financing.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Before making decisions
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Verify important financial, legal, credit, and borrowing decisions
            with qualified professionals and official providers. CreditCrest AI
            is a learning tool, not a decision-maker.
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center rounded-md bg-[#06130f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Read the privacy overview
          </Link>
        </div>
      </section>
    </main>
  );
}

function DisclaimerCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-[#06130f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
