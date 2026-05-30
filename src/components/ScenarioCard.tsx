import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CreditCard,
  FilePlus2,
  Laptop,
  Phone,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { DirectionBadge, RiskBadge } from "@/components/RiskBadge";
import {
  creditFactorLabels,
  simulateScenario,
  type CreditProfile,
  type CreditScenario,
  type ScenarioType,
} from "@/lib/creditEngine";

const scenarioIcons: Record<ScenarioType, React.ComponentType<{ className?: string }>> =
  {
    buyWithCard: Laptop,
    payDownBalance: Banknote,
    applyForCard: FilePlus2,
    missPayment: ShieldAlert,
    minimumOnly: CreditCard,
    financePurchase: Phone,
    increaseLimit: TrendingUp,
    custom: CreditCard,
  };

const riskAccent: Record<string, string> = {
  Low: "from-emerald-500 to-lime-400",
  Medium: "from-amber-400 to-yellow-300",
  High: "from-orange-500 to-amber-400",
  Critical: "from-rose-500 to-orange-500",
};

export function ScenarioCard({
  scenario,
  profile,
}: {
  scenario: CreditScenario;
  profile: CreditProfile;
}) {
  const scenarioForProfile = {
    ...scenario,
    currentBalance: profile.currentBalance,
    creditLimit: profile.creditLimit,
  };
  const impact = simulateScenario(profile, scenarioForProfile);
  const Icon = scenarioIcons[scenario.type];
  const isLendingScenario = scenario.id === "finance-phone";
  const href = isLendingScenario
    ? "/lending-lab"
    : `/simulator?scenario=${scenario.id}`;

  return (
    <Link
      href={href}
      className="group relative block min-h-[210px] overflow-hidden rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${riskAccent[impact.riskLevel]}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700 transition group-hover:scale-105">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <RiskBadge level={impact.riskLevel} />
      </div>
      <h3 className="mt-4 text-base font-black text-[#06130f]">
        {scenario.title}
      </h3>
      {isLendingScenario ? (
        <p className="mt-2 text-sm leading-5 text-slate-600">
          Opens Lending Lab for EMI, APR, and synthetic loan-path comparison.
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <DirectionBadge direction={impact.impactDirection} />
      </div>
      <div className="mt-4 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
        <p className="text-xs font-bold uppercase text-slate-500">Primary factor</p>
        <p className="mt-1 text-sm font-black text-[#06130f]">
          {creditFactorLabels[impact.primaryFactor]}
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          {impact.beforeUtilization}% to {impact.afterUtilization}% utilization
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-md bg-[#06130f] px-3 py-2 text-sm font-bold text-white">
        <span>{isLendingScenario ? "Open Lending Lab" : "Simulate"}</span>
        <ArrowRight
          className="h-4 w-4 transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
