import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gauge,
  PlayCircle,
} from "lucide-react";

import { FactorBreakdown } from "@/components/FactorBreakdown";
import { ScenarioCard } from "@/components/ScenarioCard";
import { UtilizationChart } from "@/components/UtilizationChart";
import {
  calculateUtilization,
  getFactorBreakdown,
  type CreditProfile,
  type CreditScenario,
} from "@/lib/creditEngine";
import { formatCurrency } from "@/lib/format";

export function CreditDashboard({
  profile,
  scenarios,
}: {
  profile: CreditProfile;
  scenarios: CreditScenario[];
}) {
  const utilization = calculateUtilization(profile.currentBalance, profile.creditLimit);
  const displayUtilization = Math.round(utilization);
  const breakdown = getFactorBreakdown(profile);
  const laptopScenario = scenarios.find((scenario) => scenario.id === "buy-laptop");
  const payScenario = scenarios.find((scenario) => scenario.id === "pay-300");

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Guided Learning Mode
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black text-[#06130f] sm:text-5xl">
            CreditCrest AI
          </h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-slate-700">
            Know the credit impact before you make the move.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            CreditCrest AI is a consumer credit simulator that helps people
            explore borrowing and credit-building tradeoffs before they act,
            using transparent educational rules instead of official score
            predictions.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/simulator"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06130f] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Simulate a Decision
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/plan"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cbd8ce] bg-white px-4 py-3 text-sm font-bold text-[#06130f] shadow-sm transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Open 30-Day Plan
            </Link>
            <Link
              href="/lending-lab"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900 shadow-sm transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Open Lending Lab
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-700">
                Synthetic profile
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#06130f]">
                {profile.name}, {profile.age}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {profile.persona}
              </p>
            </div>
            <div className="rounded-md bg-[#eaf7ef] px-3 py-2 text-right">
              <p className="text-xs font-bold text-slate-500">Education band</p>
              <p className="text-lg font-black text-[#06130f]">
                {profile.estimatedCreditBand}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Card limit" value={formatCurrency(profile.creditLimit)} />
            <Metric
              label="Current balance"
              value={formatCurrency(profile.currentBalance)}
            />
            <Metric label="Utilization" value={`${displayUtilization}%`} />
          </div>

          <div className="mt-6">
            <UtilizationChart
              balance={profile.currentBalance}
              limit={profile.creditLimit}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce5dd] bg-[#06130f]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div className="text-white">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              Quick Start Journey
            </div>
            <p className="mt-2 text-sm leading-6 text-emerald-50">
              A guided demo through credit impact, safer action, planning, and
              transparent rules.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {laptopScenario ? (
              <DemoStep
                number="1"
                href={`/simulator?scenario=${laptopScenario.id}`}
                label="Buy $600 laptop"
                caption="Show 88.7% utilization"
              />
            ) : null}
            {payScenario ? (
              <DemoStep
                number="2"
                href={`/simulator?scenario=${payScenario.id}`}
                label="Pay $300"
                caption="Show safer utilization"
              />
            ) : null}
            <DemoStep
              number="3"
              href="/plan"
              label="Open 30-day plan"
              caption="Turn advice into action"
              icon={ClipboardCheck}
            />
            <DemoStep
              number="4"
              href="/methodology"
              label="View methodology"
              caption="Prove the rules are explicit"
              icon={FileText}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-sm font-bold uppercase text-emerald-700">
            CreditCrest ecosystem
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#06130f]">
            Learn first. Simulate the lending journey next.
          </h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <EcosystemCard
            icon={BookOpen}
            title="CreditCrest AI"
            body="Teaches and simulates consumer credit decisions with synthetic data, directional impact labels, and deterministic rules."
            href="/simulator"
            action="Open credit simulator"
          />
          <EcosystemCard
            icon={FlaskConical}
            title="CrestLend"
            body="Handles the simulated lending journey inside Lending Lab: synthetic offers, EMI modeling, approval-readiness, and borrower timelines."
            href="/lending-lab"
            action="Open CrestLend journey"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#06130f]">Health summary</h2>
            <p className="mt-1 text-sm text-slate-600">
              Deterministic factor model based on the synthetic Maya profile.
            </p>
          </div>
          <BadgeCheck className="hidden h-7 w-7 text-emerald-700 sm:block" />
        </div>
        <FactorBreakdown items={breakdown} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#06130f]">Instant scenarios</h2>
            <p className="mt-1 text-sm text-slate-600">
              Click any decision and the simulator opens with a modeled result.
            </p>
          </div>
          <Link
            href="/scenarios"
            className="hidden text-sm font-bold text-emerald-800 hover:text-emerald-950 sm:inline-flex"
          >
            View library
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.slice(0, 3).map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              profile={profile}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function EcosystemCard({
  icon: Icon,
  title,
  body,
  href,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-black text-[#06130f]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-800">
            {action}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-[#06130f]">{value}</p>
    </div>
  );
}

function DemoStep({
  number,
  href,
  label,
  caption,
  icon: Icon,
}: {
  number: string;
  href: string;
  label: string;
  caption: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-md border border-emerald-700 bg-white/10 px-3 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-300 text-[#06130f]">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : number}
      </span>
      <span className="min-w-0">
        <span className="block truncate">{label}</span>
        <span className="mt-0.5 block truncate text-xs font-semibold text-emerald-100">
          {number}. {caption}
        </span>
      </span>
    </Link>
  );
}
