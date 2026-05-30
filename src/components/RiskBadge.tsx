import type { ImpactDirection, RiskLevel } from "@/lib/creditEngine";

const riskStyles: Record<RiskLevel, string> = {
  Low: "border-emerald-300 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-300 bg-amber-50 text-amber-900",
  High: "border-orange-300 bg-orange-50 text-orange-900",
  Critical: "border-rose-300 bg-rose-50 text-rose-900",
};

const directionStyles: Record<ImpactDirection, string> = {
  Helps: "border-emerald-300 bg-emerald-50 text-emerald-800",
  Neutral: "border-slate-300 bg-slate-50 text-slate-700",
  "Slight risk": "border-amber-300 bg-amber-50 text-amber-900",
  "Significant risk": "border-rose-300 bg-rose-50 text-rose-900",
};

export function RiskBadge({
  level,
  className = "",
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${riskStyles[level]} ${className}`}
    >
      {level}
    </span>
  );
}

export function DirectionBadge({
  direction,
  className = "",
}: {
  direction: ImpactDirection;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${directionStyles[direction]} ${className}`}
    >
      {direction}
    </span>
  );
}
