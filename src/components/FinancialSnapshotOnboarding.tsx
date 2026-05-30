"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  clearFinancialSnapshot,
  loadFinancialSnapshot,
  missedPaymentHistoryLabels,
  primaryGoalLabels,
  saveFinancialSnapshot,
  type FinancialSnapshot,
  type MissedPaymentHistoryRange,
  type PrimaryFinancialGoal,
} from "@/lib/financialSnapshot";
import type { LendingProfile } from "@/lib/lendingEngine";

const missedPaymentOptions = Object.entries(missedPaymentHistoryLabels) as [
  MissedPaymentHistoryRange,
  string,
][];

const goalOptions = Object.entries(primaryGoalLabels) as [
  PrimaryFinancialGoal,
  string,
][];

export function FinancialSnapshotOnboarding({
  fallbackProfile,
}: {
  fallbackProfile: LendingProfile;
}) {
  const [form, setForm] = useState<FinancialSnapshot>(
    () => loadFinancialSnapshot() ?? createFallbackSnapshot(fallbackProfile),
  );
  const [status, setStatus] = useState(
    loadFinancialSnapshot()
      ? "Your local snapshot is ready to personalize simulations."
      : "Maya's demo profile is active until you save a snapshot.",
  );

  function updateField<Key extends keyof FinancialSnapshot>(
    key: Key,
    value: FinancialSnapshot[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateNumberField(
    key:
      | "monthlyIncomeEstimate"
      | "monthlyDebtObligations"
      | "creditCardBalance"
      | "creditCardLimit"
      | "recentInquiries"
      | "oldestAccountAgeMonths",
    value: number,
  ) {
    setForm((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = saveFinancialSnapshot({
      ...form,
      updatedAt: new Date().toISOString(),
    });

    setStatus(
      saved
        ? "Financial Snapshot saved. Stored only in this browser."
        : "Add a nickname and credit limit above $0 to save a snapshot.",
    );
  }

  function handleClear() {
    clearFinancialSnapshot();
    setForm(createFallbackSnapshot(fallbackProfile));
    setStatus("Financial Snapshot deleted. Maya demo profile is active.");
  }

  function handleUseDemo() {
    clearFinancialSnapshot();
    setForm(createFallbackSnapshot(fallbackProfile));
    setStatus("Using Maya demo profile. No Financial Snapshot is stored.");
  }

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Stored only in this browser
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black text-[#06130f] sm:text-5xl">
              Create a Financial Snapshot.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Personalize CreditCrest AI with rounded, non-sensitive inputs.
              The snapshot stays in localStorage on this device and can be
              deleted at any time.
            </p>
          </div>

          <div className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#06130f]">
                  Privacy-safe personalization
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No SSNs, account numbers, full dates of birth, bank
                  credentials, bureau credentials, document uploads, real loan
                  applications, or lender matching.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#06130f]">
              Learning profile status
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{status}</p>
            <div className="mt-5 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-4">
              <p className="text-xs font-black uppercase text-slate-500">
                Active fallback
              </p>
              <p className="mt-1 text-lg font-black text-[#06130f]">
                Maya demo profile
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                If no snapshot is saved, every simulator continues to use the
                synthetic Maya profile.
              </p>
            </div>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={handleUseDemo}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cbd8ce] bg-white px-4 py-3 text-sm font-bold text-[#06130f] transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Use Maya demo profile
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 transition hover:border-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete snapshot
              </button>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
                <WalletCards className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#06130f]">
                  Snapshot inputs
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use estimates that are good enough for education. CreditCrest
                  AI does not verify income, connect to banks, or predict an
                  official score.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-[#06130f]">
                First name or nickname
                <input
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Example: Maya"
                />
              </label>
              <NumberInput
                label="Monthly income estimate"
                value={form.monthlyIncomeEstimate}
                onChange={(value) =>
                  updateNumberField("monthlyIncomeEstimate", value)
                }
              />
              <NumberInput
                label="Monthly debt obligations"
                value={form.monthlyDebtObligations}
                onChange={(value) =>
                  updateNumberField("monthlyDebtObligations", value)
                }
              />
              <NumberInput
                label="Credit card balance"
                value={form.creditCardBalance}
                onChange={(value) =>
                  updateNumberField("creditCardBalance", value)
                }
              />
              <NumberInput
                label="Credit card limit"
                value={form.creditCardLimit}
                min={1}
                onChange={(value) => updateNumberField("creditCardLimit", value)}
              />
              <NumberInput
                label="Recent inquiries count"
                value={form.recentInquiries}
                step={1}
                onChange={(value) => updateNumberField("recentInquiries", value)}
              />
              <label className="grid gap-2 text-sm font-bold text-[#06130f]">
                Missed payment history
                <select
                  value={form.missedPaymentHistory}
                  onChange={(event) =>
                    updateField(
                      "missedPaymentHistory",
                      event.target.value as MissedPaymentHistoryRange,
                    )
                  }
                  className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {missedPaymentOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <NumberInput
                label="Oldest account age"
                suffix="months"
                value={form.oldestAccountAgeMonths}
                step={1}
                onChange={(value) =>
                  updateNumberField("oldestAccountAgeMonths", value)
                }
              />
              <label className="grid gap-2 text-sm font-bold text-[#06130f] sm:col-span-2">
                Primary goal
                <select
                  value={form.primaryGoal}
                  onChange={(event) =>
                    updateField("primaryGoal", event.target.value as PrimaryFinancialGoal)
                  }
                  className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {goalOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-emerald-950">
                  Stored only in this browser. The snapshot personalizes
                  educational simulations and can be reset without affecting any
                  external account.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06130f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Save Financial Snapshot
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cbd8ce] bg-white px-4 py-3 text-sm font-bold text-[#06130f] transition hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                View personalized dashboard
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function NumberInput({
  label,
  value,
  min = 0,
  step = 0.01,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#06130f]">
      {label}
      <div className="flex rounded-md border border-[#cbd8ce] bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-3 text-sm font-semibold text-slate-800 outline-none"
        />
        {suffix ? (
          <span className="flex items-center px-3 text-sm font-bold text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function createFallbackSnapshot(profile: LendingProfile): FinancialSnapshot {
  return {
    firstName: profile.name,
    monthlyIncomeEstimate: profile.estimatedMonthlyIncome,
    monthlyDebtObligations: profile.monthlyDebtObligations ?? 0,
    creditCardBalance: profile.currentBalance,
    creditCardLimit: profile.creditLimit,
    recentInquiries: profile.recentInquiries,
    missedPaymentHistory:
      profile.latePayments.count === 0
        ? "none"
        : profile.latePayments.count === 1
          ? "one-last-12"
          : "more-than-one",
    oldestAccountAgeMonths: profile.oldestAccountAgeMonths,
    primaryGoal: "build-credit",
    updatedAt: new Date().toISOString(),
  };
}
