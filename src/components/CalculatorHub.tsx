"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  BadgeDollarSign,
  Calculator,
  CreditCard,
  Gauge,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import {
  calculateCreditLimitImpact,
  calculateEmiScenario,
  calculatePaymentBurdenScenario,
  calculateUtilizationPaydown,
  compareAprOptions,
  type LendingProfile,
  type SyntheticLoanOffer,
} from "@/lib/lendingEngine";
import { formatCurrency, formatCurrencyCents } from "@/lib/format";
import { useFinancialSnapshotLendingProfile } from "@/lib/useFinancialSnapshot";

export function CalculatorHub({
  profile,
  offers,
}: {
  profile: LendingProfile;
  offers: SyntheticLoanOffer[];
}) {
  const activeProfile = useFinancialSnapshotLendingProfile(profile);
  const [emiInput, setEmiInput] = useState({
    principal: 800,
    annualApr: 18,
    termMonths: 12,
    downPayment: 100,
  });
  const [paydownOverrides, setPaydownOverrides] = useState<{
    currentBalance?: number;
    creditLimit?: number;
    target: string;
    customTarget: number;
  }>({
    target: "30",
    customTarget: 15,
  });
  const [aprInput, setAprInput] = useState({
    optionAId: "crest-builder-secured",
    optionBId: "crest-fastcash",
  });
  const [burdenOverrides, setBurdenOverrides] = useState<{
    monthlyPayment: number;
    syntheticMonthlyIncome?: number;
  }>({
    monthlyPayment: 150,
  });
  const [limitOverrides, setLimitOverrides] = useState<{
    currentBalance?: number;
    currentLimit?: number;
    proposedNewLimit?: number;
  }>({});

  const paydownInput = useMemo(
    () => ({
      currentBalance:
        paydownOverrides.currentBalance ?? activeProfile.currentBalance,
      creditLimit: paydownOverrides.creditLimit ?? activeProfile.creditLimit,
      target: paydownOverrides.target,
      customTarget: paydownOverrides.customTarget,
    }),
    [
      activeProfile.creditLimit,
      activeProfile.currentBalance,
      paydownOverrides.creditLimit,
      paydownOverrides.currentBalance,
      paydownOverrides.customTarget,
      paydownOverrides.target,
    ],
  );
  const burdenInput = useMemo(
    () => ({
      monthlyPayment: burdenOverrides.monthlyPayment,
      syntheticMonthlyIncome:
        burdenOverrides.syntheticMonthlyIncome ??
        activeProfile.estimatedMonthlyIncome,
    }),
    [
      activeProfile.estimatedMonthlyIncome,
      burdenOverrides.monthlyPayment,
      burdenOverrides.syntheticMonthlyIncome,
    ],
  );
  const limitInput = useMemo(
    () => ({
      currentBalance:
        limitOverrides.currentBalance ?? activeProfile.currentBalance,
      currentLimit: limitOverrides.currentLimit ?? activeProfile.creditLimit,
      proposedNewLimit:
        limitOverrides.proposedNewLimit ??
        Math.max(activeProfile.creditLimit + 500, 2500),
    }),
    [
      activeProfile.creditLimit,
      activeProfile.currentBalance,
      limitOverrides.currentBalance,
      limitOverrides.currentLimit,
      limitOverrides.proposedNewLimit,
    ],
  );

  const emiResult = useMemo(() => calculateEmiScenario(emiInput), [emiInput]);
  const paydownTarget =
    paydownInput.target === "custom"
      ? paydownInput.customTarget
      : Number(paydownInput.target);
  const paydownResult = useMemo(
    () =>
      calculateUtilizationPaydown(
        paydownInput.currentBalance,
        paydownInput.creditLimit,
        paydownTarget,
      ),
    [paydownInput.currentBalance, paydownInput.creditLimit, paydownTarget],
  );
  const selectedA = offers.find((offer) => offer.id === aprInput.optionAId) ?? offers[0];
  const selectedB = offers.find((offer) => offer.id === aprInput.optionBId) ?? offers[1];
  const aprResult = useMemo(
    () =>
      compareAprOptions(
        {
          name: selectedA.name,
          principal: selectedA.principal,
          annualApr: selectedA.annualApr,
          termMonths: selectedA.termMonths,
        },
        {
          name: selectedB.name,
          principal: selectedB.principal,
          annualApr: selectedB.annualApr,
          termMonths: selectedB.termMonths,
        },
      ),
    [selectedA, selectedB],
  );
  const burdenResult = useMemo(
    () =>
      calculatePaymentBurdenScenario(
        burdenInput.monthlyPayment,
        burdenInput.syntheticMonthlyIncome,
      ),
    [burdenInput],
  );
  const limitResult = useMemo(
    () =>
      calculateCreditLimitImpact(
        limitInput.currentBalance,
        limitInput.currentLimit,
        limitInput.proposedNewLimit,
      ),
    [limitInput],
  );

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Calculator Hub
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black text-[#06130f] sm:text-5xl">
              Calculate the borrowing tradeoff before {activeProfile.name} commits.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Educational calculators for EMI, utilization paydown, APR
              comparisons, payment burden, and credit-limit impact. Synthetic
              defaults only; no sensitive data collection.
            </p>
          </div>
          <div className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#06130f]">
                  Active profile defaults, educational results
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These tools use your local Financial Snapshot when saved, or
                  Maya&apos;s synthetic profile by default, including{" "}
                  {formatCurrency(activeProfile.estimatedMonthlyIncome)}/month
                  synthetic income estimate. They do not request bank
                  credentials, SSNs, or credit bureau data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <CalculatorCard
            icon={BadgeDollarSign}
            title="EMI / Monthly Payment Calculator"
            subtitle="Model principal, APR, term, and down payment."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Principal"
                value={emiInput.principal}
                onChange={(principal) =>
                  setEmiInput((current) => ({ ...current, principal }))
                }
              />
              <NumberInput
                label="Down payment"
                value={emiInput.downPayment}
                onChange={(downPayment) =>
                  setEmiInput((current) => ({ ...current, downPayment }))
                }
              />
              <NumberInput
                label="APR"
                suffix="%"
                value={emiInput.annualApr}
                onChange={(annualApr) =>
                  setEmiInput((current) => ({ ...current, annualApr }))
                }
              />
              <NumberInput
                label="Term"
                suffix="mo"
                value={emiInput.termMonths}
                onChange={(termMonths) =>
                  setEmiInput((current) => ({ ...current, termMonths }))
                }
              />
            </div>
            <ResultGrid>
              <Metric
                label="Financed amount"
                value={formatCurrency(emiResult.financedPrincipal)}
              />
              <Metric
                label="Monthly payment"
                value={formatCurrencyCents(emiResult.monthlyPayment)}
              />
              <Metric
                label="Total repayment"
                value={formatCurrencyCents(emiResult.totalRepayment)}
              />
              <Metric
                label="Total interest"
                value={formatCurrencyCents(emiResult.totalInterest)}
              />
            </ResultGrid>
          </CalculatorCard>

          <CalculatorCard
            icon={CreditCard}
            title="Utilization Paydown Calculator"
            subtitle="Find the payment needed to reach a target utilization."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Current balance"
                value={paydownInput.currentBalance}
                onChange={(currentBalance) =>
                  setPaydownOverrides((current) => ({
                    ...current,
                    currentBalance,
                  }))
                }
              />
              <NumberInput
                label="Credit limit"
                value={paydownInput.creditLimit}
                onChange={(creditLimit) =>
                  setPaydownOverrides((current) => ({ ...current, creditLimit }))
                }
              />
              <label className="grid gap-2 text-sm font-bold text-[#06130f]">
                Target utilization
                <select
                  value={paydownInput.target}
                  onChange={(event) =>
                    setPaydownOverrides((current) => ({
                      ...current,
                      target: event.target.value,
                    }))
                  }
                  className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="30">30%</option>
                  <option value="10">10%</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              {paydownInput.target === "custom" ? (
                <NumberInput
                  label="Custom target"
                  suffix="%"
                  value={paydownInput.customTarget}
                  onChange={(customTarget) =>
                    setPaydownOverrides((current) => ({
                      ...current,
                      customTarget,
                    }))
                  }
                />
              ) : null}
            </div>
            <ResultGrid>
              <Metric
                label="Amount to pay down"
                value={formatCurrencyCents(paydownResult.amountNeeded)}
              />
              <Metric
                label="Before utilization"
                value={`${paydownResult.beforeUtilization}%`}
                badge={<RiskBadge level={paydownResult.beforeRisk} />}
              />
              <Metric
                label="After utilization"
                value={`${paydownResult.afterUtilization}%`}
                badge={<RiskBadge level={paydownResult.afterRisk} />}
              />
            </ResultGrid>
          </CalculatorCard>

          <CalculatorCard
            icon={ArrowRightLeft}
            title="APR Comparison Calculator"
            subtitle="Compare two synthetic loan paths side by side."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <OfferSelect
                label="Option A"
                value={aprInput.optionAId}
                offers={offers}
                onChange={(optionAId) =>
                  setAprInput((current) => ({ ...current, optionAId }))
                }
              />
              <OfferSelect
                label="Option B"
                value={aprInput.optionBId}
                offers={offers}
                onChange={(optionBId) =>
                  setAprInput((current) => ({ ...current, optionBId }))
                }
              />
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ComparisonPanel option={aprResult.optionA} />
              <ComparisonPanel option={aprResult.optionB} />
            </div>
            <ResultGrid>
              <Metric
                label="Monthly difference"
                value={formatCurrencyCents(aprResult.monthlyPaymentDifference)}
              />
              <Metric
                label="Interest difference"
                value={formatCurrencyCents(aprResult.totalInterestDifference)}
              />
              <Metric
                label="Repayment difference"
                value={formatCurrencyCents(aprResult.totalRepaymentDifference)}
              />
            </ResultGrid>
          </CalculatorCard>

          <CalculatorCard
            icon={Gauge}
            title="Payment Burden Calculator"
            subtitle="Compare payment size with synthetic monthly income."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Monthly payment"
                value={burdenInput.monthlyPayment}
                onChange={(monthlyPayment) =>
                  setBurdenOverrides((current) => ({
                    ...current,
                    monthlyPayment,
                  }))
                }
              />
              <NumberInput
                label="Synthetic monthly income"
                value={burdenInput.syntheticMonthlyIncome}
                onChange={(syntheticMonthlyIncome) =>
                  setBurdenOverrides((current) => ({
                    ...current,
                    syntheticMonthlyIncome,
                  }))
                }
              />
            </div>
            <ResultGrid>
              <Metric
                label="Payment burden"
                value={`${burdenResult.paymentBurdenPercent}%`}
                badge={<RiskBadge level={burdenResult.paymentBurdenRisk} />}
              />
              <Metric
                label="Synthetic income"
                value={formatCurrency(burdenResult.syntheticMonthlyIncome)}
              />
            </ResultGrid>
            <p className="mt-4 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3 text-sm leading-6 text-slate-600">
              {burdenResult.warning}
            </p>
          </CalculatorCard>

          <CalculatorCard
            icon={TrendingUp}
            title="Credit Limit Impact Calculator"
            subtitle="Model utilization if the limit changes and balance stays fixed."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <NumberInput
                label="Current balance"
                value={limitInput.currentBalance}
                onChange={(currentBalance) =>
                  setLimitOverrides((current) => ({ ...current, currentBalance }))
                }
              />
              <NumberInput
                label="Current limit"
                value={limitInput.currentLimit}
                onChange={(currentLimit) =>
                  setLimitOverrides((current) => ({ ...current, currentLimit }))
                }
              />
              <NumberInput
                label="Proposed new limit"
                value={limitInput.proposedNewLimit}
                onChange={(proposedNewLimit) =>
                  setLimitOverrides((current) => ({
                    ...current,
                    proposedNewLimit,
                  }))
                }
              />
            </div>
            <ResultGrid>
              <Metric
                label="Before utilization"
                value={`${limitResult.beforeUtilization}%`}
                badge={<RiskBadge level={limitResult.beforeRisk} />}
              />
              <Metric
                label="After utilization"
                value={`${limitResult.afterUtilization}%`}
                badge={<RiskBadge level={limitResult.afterRisk} />}
              />
            </ResultGrid>
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
              {limitResult.explanation}
            </p>
          </CalculatorCard>
        </div>
      </section>
    </main>
  );
}

function CalculatorCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#06130f]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function NumberInput({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#06130f]">
      {label}
      <div className="flex rounded-md border border-[#cbd8ce] bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
        <input
          type="number"
          min="0"
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

function OfferSelect({
  label,
  value,
  offers,
  onChange,
}: {
  label: string;
  value: string;
  offers: SyntheticLoanOffer[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#06130f]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-[#cbd8ce] bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {offers.map((offer) => (
          <option key={offer.id} value={offer.id}>
            {offer.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Metric({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-black uppercase text-slate-500">{label}</p>
        {badge}
      </div>
      <p className="mt-2 text-lg font-black text-[#06130f]">{value}</p>
    </div>
  );
}

function ComparisonPanel({
  option,
}: {
  option: {
    name: string;
    annualApr: number;
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  };
}) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3">
      <h3 className="text-sm font-black text-[#06130f]">{option.name}</h3>
      <div className="mt-3 grid gap-2 text-sm text-slate-600">
        <div className="flex justify-between gap-3">
          <span>APR</span>
          <span className="font-bold text-[#06130f]">{option.annualApr}%</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Monthly</span>
          <span className="font-bold text-[#06130f]">
            {formatCurrencyCents(option.monthlyPayment)}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Total interest</span>
          <span className="font-bold text-[#06130f]">
            {formatCurrencyCents(option.totalInterest)}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Total repayment</span>
          <span className="font-bold text-[#06130f]">
            {formatCurrencyCents(option.totalRepayment)}
          </span>
        </div>
      </div>
    </div>
  );
}
