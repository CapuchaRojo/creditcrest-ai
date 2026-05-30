"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  FlaskConical,
  Landmark,
  ListChecks,
  Percent,
  ShieldCheck,
} from "lucide-react";

import { ApprovalReadinessMeter } from "@/components/ApprovalReadinessMeter";
import { EducationUnlockCard } from "@/components/EducationUnlockCard";
import { LoanOfferCard } from "@/components/LoanOfferCard";
import { LoanTimeline } from "@/components/LoanTimeline";
import { RiskBadge } from "@/components/RiskBadge";
import {
  simulateLoanOffer,
  type LendingProfile,
  type LoanSimulationResult,
  type SyntheticLoanOffer,
} from "@/lib/lendingEngine";
import { formatCurrency, formatCurrencyCents } from "@/lib/format";

export function LendingLab({
  profile,
  offers,
}: {
  profile: LendingProfile;
  offers: SyntheticLoanOffer[];
}) {
  const [selectedOfferId, setSelectedOfferId] = useState(
    offers[0]?.id ?? "crest-starter",
  );
  const simulations = useMemo(
    () =>
      offers.map((offer) => ({
        offer,
        result: simulateLoanOffer(profile, offer),
      })),
    [offers, profile],
  );
  const selected =
    simulations.find((item) => item.offer.id === selectedOfferId) ??
    simulations[0];

  if (!selected) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Synthetic offers only
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black text-[#06130f] sm:text-5xl">
              Simulate the loan before Maya signs.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare synthetic lending paths, monthly payments,
              approval-readiness, and credit behavior tradeoffs.
            </p>
          </div>

          <div className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#06130f]">
                  Compliance-safe lending playground
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No real loan application, no approval or denial, no sensitive
                  identifiers, no lender matching, and no official score impact
                  prediction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-700">
                Synthetic lending marketplace
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#06130f]">
                Pick a path to compare.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Maya&apos;s synthetic income is {formatCurrency(profile.estimatedMonthlyIncome)}
              /month. The app never asks for real income.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {simulations.map(({ offer, result }) => (
              <LoanOfferCard
                key={offer.id}
                offer={offer}
                result={result}
                selected={offer.id === selected.offer.id}
                onSelect={() => setSelectedOfferId(offer.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <LoanSummary offer={selected.offer} result={selected.result} />
          <div className="grid gap-5">
            <ApprovalReadinessMeter result={selected.result} />
            <DecisionTrace result={selected.result} />
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <LoanTimeline items={selected.result.timeline} />
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-emerald-700">
                  Learning while borrowing
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#06130f]">
                  Education unlocks
                </h2>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {selected.result.educationUnlocks.map((unlock) => (
                <EducationUnlockCard key={unlock.id} unlock={unlock} />
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function LoanSummary({
  offer,
  result,
}: {
  offer: SyntheticLoanOffer;
  result: LoanSimulationResult;
}) {
  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-700">
            Selected synthetic offer
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#06130f]">
            {offer.name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {offer.purpose} - {offer.positioning}
          </p>
        </div>
        <RiskBadge level={result.riskLevel} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <LoanMetric
          icon={BadgeDollarSign}
          label="Monthly payment / EMI"
          value={formatCurrencyCents(result.monthlyPayment)}
        />
        <LoanMetric
          icon={Landmark}
          label="Total repayment"
          value={formatCurrencyCents(result.totalRepayment)}
        />
        <LoanMetric
          icon={Percent}
          label="Total interest"
          value={formatCurrencyCents(result.totalInterest)}
        />
        <LoanMetric icon={Percent} label="APR" value={`${offer.annualApr}%`} />
        <LoanMetric label="Term" value={`${offer.termMonths} months`} />
        <LoanMetric
          label="Payment burden"
          value={`${result.paymentBurdenPercent}%`}
          detail={`${result.paymentBurdenRisk} risk`}
        />
      </div>

      <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <ArrowRight
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-sm font-black text-[#06130f]">
              Recommended safer alternative
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {result.recommendedAlternative}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[#dce5dd] bg-[#f8faf8] p-4">
        <h3 className="text-sm font-black text-[#06130f]">Explanation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {result.explanation}
        </p>
      </div>
    </section>
  );
}

function LoanMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      {Icon ? (
        <Icon className="h-4 w-4 text-emerald-700" aria-hidden="true" />
      ) : null}
      <p className="mt-2 text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-[#06130f]">{value}</p>
      {detail ? <p className="mt-1 text-xs font-bold text-slate-500">{detail}</p> : null}
    </div>
  );
}

function DecisionTrace({ result }: { result: LoanSimulationResult }) {
  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black text-[#06130f]">
        <ListChecks className="h-4 w-4 text-emerald-700" aria-hidden="true" />
        Lending decision trace
      </div>
      <ol className="mt-3 grid gap-2">
        {result.decisionTrace.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className="grid grid-cols-[1.75rem_1fr] gap-3 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#06130f] text-xs font-black text-white">
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-black text-[#06130f]">
                {step.label}
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                {step.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
