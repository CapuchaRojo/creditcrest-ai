import {
  Clock3,
  CreditCard,
  FileSearch,
  History,
  Layers3,
} from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import type { CreditFactor, FactorBreakdownItem } from "@/lib/creditEngine";

const factorIcons: Record<CreditFactor, React.ComponentType<{ className?: string }>> =
  {
    paymentHistory: History,
    utilization: CreditCard,
    newCredit: FileSearch,
    creditAge: Clock3,
    creditMix: Layers3,
  };

export function FactorBreakdown({
  items,
}: {
  items: FactorBreakdownItem[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = factorIcons[item.factor];

        return (
          <article
            key={item.factor}
            className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <RiskBadge level={item.level} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#06130f]">{item.label}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">{item.metric}</p>
            <p className="mt-3 text-sm text-slate-600">{item.detail}</p>
          </article>
        );
      })}
    </div>
  );
}
