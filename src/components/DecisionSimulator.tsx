"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { DirectionBadge, RiskBadge } from "@/components/RiskBadge";
import {
  creditFactorLabels,
  simulateScenario,
  type CreditImpactResult,
  type CreditProfile,
  type CreditScenario,
  type ScenarioType,
} from "@/lib/creditEngine";
import { getScenarioById, prebuiltScenarios } from "@/lib/demoData";
import { formatCurrency } from "@/lib/format";

type SimulatorForm = Required<
  Pick<CreditScenario, "title" | "type" | "currentBalance" | "creditLimit">
> &
  Pick<
    CreditScenario,
    | "id"
    | "purchaseAmount"
    | "paymentAmount"
    | "newApplication"
    | "missedPayment"
    | "financing"
    | "minimumOnly"
    | "creditLimitIncrease"
    | "hardInquiry"
    | "description"
  >;

const scenarioOptions: { type: ScenarioType; label: string }[] = [
  { type: "buyWithCard", label: "Buy item with credit card" },
  { type: "payDownBalance", label: "Pay down balance" },
  { type: "applyForCard", label: "Apply for new card" },
  { type: "missPayment", label: "Miss a payment" },
  { type: "minimumOnly", label: "Pay only minimum" },
  { type: "financePurchase", label: "Finance phone/laptop" },
  { type: "increaseLimit", label: "Increase credit limit" },
  { type: "custom", label: "Custom scenario" },
];

export function DecisionSimulator({
  profile,
  initialScenarioId,
}: {
  profile: CreditProfile;
  initialScenarioId?: string | null;
}) {
  const [form, setForm] = useState<SimulatorForm>(() =>
    hydrateScenario(profile, getScenarioById(initialScenarioId)),
  );

  useEffect(() => {
    window.localStorage.setItem("creditcrest:last-scenario", JSON.stringify(form));
  }, [form]);

  const scenario = useMemo<CreditScenario>(() => ({ ...form }), [form]);
  const impact = useMemo(
    () => simulateScenario(profile, scenario),
    [profile, scenario],
  );

  function loadScenario(nextScenario: CreditScenario | undefined) {
    setForm(hydrateScenario(profile, nextScenario));
  }

  function updateForm<Key extends keyof SimulatorForm>(
    key: Key,
    value: SimulatorForm[Key],
  ) {
    setForm((current) => ({
      ...current,
      id: "custom-live",
      title: current.title === "Custom scenario" ? current.title : "Custom scenario",
      [key]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Decision Simulator
            </div>
            <h1 className="mt-4 text-3xl font-black text-[#06130f] sm:text-4xl">
              Model the move before Maya makes it.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              This simulator uses transparent local rules. It gives directional
              education only and does not calculate an official credit score.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadScenario(undefined)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cbd8ce] bg-white px-4 py-3 text-sm font-bold text-[#06130f] shadow-sm transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to Maya
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black text-[#06130f]">Scenario controls</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {prebuiltScenarios.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => loadScenario(option)}
                  className={`rounded-md border px-3 py-2 text-left text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                    form.id === option.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-[#dce5dd] bg-[#f8faf8] text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  {option.title}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-[#06130f]">
                Scenario type
                <select
                  value={form.type}
                  onChange={(event) =>
                    updateForm("type", event.target.value as ScenarioType)
                  }
                  className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {scenarioOptions.map((option) => (
                    <option key={option.type} value={option.type}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <NumberInput
                  label="Purchase amount"
                  value={form.purchaseAmount ?? 0}
                  onChange={(value) => updateForm("purchaseAmount", value)}
                />
                <NumberInput
                  label="Payment amount"
                  value={form.paymentAmount ?? 0}
                  onChange={(value) => updateForm("paymentAmount", value)}
                />
                <NumberInput
                  label="Current card balance"
                  value={form.currentBalance}
                  onChange={(value) => updateForm("currentBalance", value)}
                />
                <NumberInput
                  label="Credit limit"
                  value={form.creditLimit}
                  onChange={(value) => updateForm("creditLimit", value)}
                />
                <NumberInput
                  label="Limit increase"
                  value={form.creditLimitIncrease ?? 0}
                  onChange={(value) => updateForm("creditLimitIncrease", value)}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Toggle
                  label="New application"
                  checked={Boolean(form.newApplication)}
                  onChange={(checked) => updateForm("newApplication", checked)}
                />
                <Toggle
                  label="Missed payment"
                  checked={Boolean(form.missedPayment)}
                  onChange={(checked) => updateForm("missedPayment", checked)}
                />
                <Toggle
                  label="Financing option"
                  checked={Boolean(form.financing)}
                  onChange={(checked) => updateForm("financing", checked)}
                />
                <Toggle
                  label="Hard inquiry"
                  checked={Boolean(form.hardInquiry)}
                  onChange={(checked) => updateForm("hardInquiry", checked)}
                />
              </div>

              <label className="grid gap-2 text-sm font-bold text-[#06130f]">
                Optional description
                <textarea
                  value={form.description ?? ""}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={3}
                  className="resize-none rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Example: laptop for school, needed before next semester"
                />
              </label>
            </div>
          </section>

          <SimulatorResult impact={impact} />
        </div>
      </section>
    </main>
  );
}

function hydrateScenario(
  profile: CreditProfile,
  scenario?: CreditScenario,
): SimulatorForm {
  return {
    id: scenario?.id ?? "custom",
    title: scenario?.title ?? "Custom scenario",
    type: scenario?.type ?? "buyWithCard",
    purchaseAmount: scenario?.purchaseAmount ?? 0,
    paymentAmount: scenario?.paymentAmount ?? 0,
    currentBalance: scenario?.currentBalance ?? profile.currentBalance,
    creditLimit: scenario?.creditLimit ?? profile.creditLimit,
    newApplication: scenario?.newApplication ?? false,
    missedPayment: scenario?.missedPayment ?? false,
    financing: scenario?.financing ?? false,
    minimumOnly: scenario?.minimumOnly ?? scenario?.type === "minimumOnly",
    creditLimitIncrease: scenario?.creditLimitIncrease ?? 0,
    hardInquiry: scenario?.hardInquiry ?? false,
    description: scenario?.description ?? "",
  };
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#06130f]">
      {label}
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-3 text-sm font-bold transition ${
        checked
          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
          : "border-[#dce5dd] bg-[#f8faf8] text-slate-700"
      }`}
    >
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-700"
      />
    </label>
  );
}

function SimulatorResult({ impact }: { impact: CreditImpactResult }) {
  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-700">
            Modeled output
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#06130f]">
            {impact.riskLevel} risk
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Main factor: {creditFactorLabels[impact.primaryFactor]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RiskBadge level={impact.riskLevel} />
          <DirectionBadge direction={impact.impactDirection} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ResultMetric
          label="Before utilization"
          value={`${impact.beforeUtilization}%`}
        />
        <ResultMetric
          label="After utilization"
          value={`${impact.afterUtilization}%`}
        />
        <ResultMetric label="Confidence" value={impact.confidence} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ResultMetric
          label="Before balance"
          value={formatCurrency(impact.beforeBalance)}
        />
        <ResultMetric
          label="After balance"
          value={formatCurrency(impact.afterBalance)}
        />
      </div>

      <div className="mt-6 space-y-4">
        <Callout
          icon={HelpCircle}
          title="Explanation"
          body={impact.explanation}
        />
        <Callout
          icon={CheckCircle2}
          title="Recommended safer alternative"
          body={impact.recommendation}
        />
        <Callout
          icon={ShieldCheck}
          title="Why this matters"
          body={impact.whyItMatters}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-black uppercase text-slate-500">
          Affected factors
        </h3>
        <div className="mt-3 grid gap-3">
          {impact.affectedFactors.map((factor, index) => (
            <div
              key={`${factor.factor}-${index}`}
              className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black text-[#06130f]">{factor.title}</p>
                <RiskBadge level={factor.level} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {factor.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/simulator?scenario=pay-300"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06130f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Try Pay $300
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/plan"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cbd8ce] bg-white px-4 py-3 text-sm font-bold text-[#06130f] transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Open 30-Day Plan
        </Link>
      </div>
    </section>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-[#06130f]">{value}</p>
    </div>
  );
}

function Callout({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-4">
      <div className="flex items-center gap-2 text-sm font-black text-[#06130f]">
        <Icon className="h-4 w-4 text-emerald-700" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
