"use client";

import {
  BadgeDollarSign,
  Check,
  Clock3,
  Percent,
  ShieldCheck,
} from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import type {
  LoanSimulationResult,
  SyntheticLoanOffer,
} from "@/lib/lendingEngine";
import { formatCurrency, formatCurrencyCents } from "@/lib/format";

export function LoanOfferCard({
  offer,
  result,
  selected,
  onSelect,
}: {
  offer: SyntheticLoanOffer;
  result: LoanSimulationResult;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative min-h-[250px] rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
        selected ? "border-emerald-500 ring-2 ring-emerald-100" : "border-[#dce5dd]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700 transition group-hover:scale-105">
          <BadgeDollarSign className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <RiskBadge level={result.riskLevel} />
          {selected ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#06130f] px-2 py-1 text-xs font-black text-white">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Selected
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-black text-[#06130f]">{offer.name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {offer.positioning}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniMetric
          icon={BadgeDollarSign}
          label="EMI"
          value={formatCurrencyCents(result.monthlyPayment)}
        />
        <MiniMetric icon={Percent} label="APR" value={`${offer.annualApr}%`} />
        <MiniMetric
          icon={Clock3}
          label="Term"
          value={`${offer.termMonths} mo`}
        />
      </div>

      <div className="mt-4 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase text-slate-500">
            Simulated principal
          </span>
          <span className="text-sm font-black text-[#06130f]">
            {formatCurrency(offer.principal)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase text-slate-500">
            Readiness
          </span>
          <span className="text-sm font-black text-emerald-800">
            {result.approvalReadiness}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {offer.hardInquiry ? (
          <Tag label="Hard inquiry" />
        ) : (
          <Tag label="No hard inquiry" />
        )}
        {offer.requiresDeposit ? <Tag label="Deposit modeled" /> : null}
        {!offer.newAccount ? <Tag label="No new account" /> : null}
      </div>
    </button>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-2">
      <Icon className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
      <p className="mt-2 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-black text-[#06130f]">{value}</p>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-900">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
