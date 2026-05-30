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

import { RiskBadge } from "@/components/RiskBadge";
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

export function ScenarioCard({
  scenario,
  profile,
}: {
  scenario: CreditScenario;
  profile: CreditProfile;
}) {
  const impact = simulateScenario(profile, scenario);
  const Icon = scenarioIcons[scenario.type];

  return (
    <Link
      href={`/simulator?scenario=${scenario.id}`}
      className="group block rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <RiskBadge level={impact.riskLevel} />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#06130f]">{scenario.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        Primary factor: {creditFactorLabels[impact.primaryFactor]}
      </p>
      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-emerald-800">
        <span>
          {impact.beforeUtilization}% to {impact.afterUtilization}%
        </span>
        <ArrowRight
          className="h-4 w-4 transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
