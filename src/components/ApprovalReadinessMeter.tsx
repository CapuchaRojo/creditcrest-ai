import { AlertTriangle, CheckCircle2, Gauge, ShieldAlert } from "lucide-react";

import type {
  ApprovalReadiness,
  LoanSimulationResult,
} from "@/lib/lendingEngine";

const readinessStyles: Record<ApprovalReadiness, string> = {
  "Likely ready": "text-emerald-800 bg-emerald-50 border-emerald-200",
  "Needs caution": "text-amber-900 bg-amber-50 border-amber-200",
  "Not ready yet": "text-rose-900 bg-rose-50 border-rose-200",
};

const readinessIcons: Record<
  ApprovalReadiness,
  React.ComponentType<{ className?: string }>
> = {
  "Likely ready": CheckCircle2,
  "Needs caution": AlertTriangle,
  "Not ready yet": ShieldAlert,
};

export function ApprovalReadinessMeter({
  result,
}: {
  result: LoanSimulationResult;
}) {
  const Icon = readinessIcons[result.approvalReadiness];

  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-[#06130f]">
            <Gauge className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Approval-readiness
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Educational readiness only. This is not approval or denial.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-black ${readinessStyles[result.approvalReadiness]}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {result.approvalReadiness}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Readiness score</span>
          <span>{result.approvalReadinessScore}/100</span>
        </div>
        <div
          className="mt-2 h-3 rounded-md bg-slate-100"
          role="meter"
          aria-label="Approval-readiness score"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={result.approvalReadinessScore}
        >
          <div
            className="h-3 rounded-md bg-emerald-600 transition-all"
            style={{ width: `${result.approvalReadinessScore}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ReadinessList
          title="Strengths"
          items={result.approvalReadinessStrengths}
          empty="No major strengths modeled for this offer."
        />
        <ReadinessList
          title="Cautions"
          items={result.approvalReadinessReasons}
          empty="No major cautions modeled for this offer."
        />
      </div>
    </section>
  );
}

function ReadinessList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      <h3 className="text-xs font-black uppercase text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-600">
        {(items.length > 0 ? items : [empty]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
