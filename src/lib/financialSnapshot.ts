import type { CreditProfile } from "@/lib/creditEngine";
import type { LendingProfile } from "@/lib/lendingEngine";

export const financialSnapshotStorageKey =
  "creditcrest:financial-snapshot";
export const financialSnapshotChangedEvent =
  "creditcrest:financial-snapshot-changed";

export type MissedPaymentHistoryRange =
  | "none"
  | "one-last-12"
  | "more-than-one";

export type PrimaryFinancialGoal =
  | "build-credit"
  | "reduce-utilization"
  | "compare-borrowing-paths"
  | "prepare-to-borrow"
  | "understand-credit-factors";

export interface FinancialSnapshot {
  firstName: string;
  monthlyIncomeEstimate: number;
  monthlyDebtObligations: number;
  creditCardBalance: number;
  creditCardLimit: number;
  recentInquiries: number;
  missedPaymentHistory: MissedPaymentHistoryRange;
  oldestAccountAgeMonths: number;
  primaryGoal: PrimaryFinancialGoal;
  updatedAt: string;
}

export interface SnapshotStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const missedPaymentHistoryLabels: Record<
  MissedPaymentHistoryRange,
  string
> = {
  none: "None",
  "one-last-12": "One in last 12 months",
  "more-than-one": "More than one",
};

export const primaryGoalLabels: Record<PrimaryFinancialGoal, string> = {
  "build-credit": "Build credit",
  "reduce-utilization": "Reduce utilization",
  "compare-borrowing-paths": "Compare borrowing paths",
  "prepare-to-borrow": "Prepare to borrow",
  "understand-credit-factors": "Understand credit factors",
};

export const primaryGoalPersona: Record<PrimaryFinancialGoal, string> = {
  "build-credit": "Learning mode / building credit",
  "reduce-utilization": "Learning mode / reducing utilization",
  "compare-borrowing-paths": "Learning mode / comparing borrowing paths",
  "prepare-to-borrow": "Learning mode / preparing to borrow",
  "understand-credit-factors": "Learning mode / understanding credit factors",
};

const missedPaymentRanges = new Set<MissedPaymentHistoryRange>([
  "none",
  "one-last-12",
  "more-than-one",
]);

const primaryGoals = new Set<PrimaryFinancialGoal>([
  "build-credit",
  "reduce-utilization",
  "compare-borrowing-paths",
  "prepare-to-borrow",
  "understand-credit-factors",
]);

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function notifySnapshotChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(financialSnapshotChangedEvent));
  }
}

function toNonNegativeNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric * 100) / 100) : 0;
}

function toNonNegativeInteger(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
}

function toSafeName(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

export function normalizeFinancialSnapshot(
  snapshot: Partial<FinancialSnapshot> | null | undefined,
): FinancialSnapshot | null {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const firstName = toSafeName(snapshot.firstName);
  const creditCardLimit = toNonNegativeNumber(snapshot.creditCardLimit);
  const oldestAccountAgeMonths = toNonNegativeInteger(
    snapshot.oldestAccountAgeMonths,
  );
  const missedPaymentHistory = missedPaymentRanges.has(
    snapshot.missedPaymentHistory as MissedPaymentHistoryRange,
  )
    ? (snapshot.missedPaymentHistory as MissedPaymentHistoryRange)
    : "none";
  const primaryGoal = primaryGoals.has(snapshot.primaryGoal as PrimaryFinancialGoal)
    ? (snapshot.primaryGoal as PrimaryFinancialGoal)
    : "build-credit";

  if (!firstName || creditCardLimit <= 0) {
    return null;
  }

  return {
    firstName,
    monthlyIncomeEstimate: toNonNegativeNumber(
      snapshot.monthlyIncomeEstimate,
    ),
    monthlyDebtObligations: toNonNegativeNumber(
      snapshot.monthlyDebtObligations,
    ),
    creditCardBalance: toNonNegativeNumber(snapshot.creditCardBalance),
    creditCardLimit,
    recentInquiries: toNonNegativeInteger(snapshot.recentInquiries),
    missedPaymentHistory,
    oldestAccountAgeMonths,
    primaryGoal,
    updatedAt:
      typeof snapshot.updatedAt === "string" && snapshot.updatedAt.length > 0
        ? snapshot.updatedAt
        : new Date().toISOString(),
  };
}

export function parseFinancialSnapshotRaw(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    return normalizeFinancialSnapshot(JSON.parse(raw) as Partial<FinancialSnapshot>);
  } catch {
    return null;
  }
}

export function loadFinancialSnapshot(storage: SnapshotStorage | null = getBrowserStorage()) {
  if (!storage) {
    return null;
  }

  return parseFinancialSnapshotRaw(storage.getItem(financialSnapshotStorageKey));
}

export function saveFinancialSnapshot(
  snapshot: Partial<FinancialSnapshot>,
  storage: SnapshotStorage | null = getBrowserStorage(),
) {
  const normalized = normalizeFinancialSnapshot(snapshot);

  if (!storage || !normalized) {
    return null;
  }

  storage.setItem(financialSnapshotStorageKey, JSON.stringify(normalized));
  notifySnapshotChanged();
  return normalized;
}

export function clearFinancialSnapshot(
  storage: SnapshotStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return;
  }

  storage.removeItem(financialSnapshotStorageKey);
  notifySnapshotChanged();
}

export function readFinancialSnapshotRaw(
  storage: SnapshotStorage | null = getBrowserStorage(),
) {
  return storage?.getItem(financialSnapshotStorageKey) ?? "";
}

export function snapshotToCreditProfile(
  snapshot: FinancialSnapshot | null | undefined,
  fallback: CreditProfile,
): CreditProfile {
  const normalized = normalizeFinancialSnapshot(snapshot);

  if (!normalized) {
    return fallback;
  }

  return {
    ...fallback,
    id: "financial-snapshot",
    name: normalized.firstName,
    persona: primaryGoalPersona[normalized.primaryGoal],
    estimatedCreditBand: "No score prediction",
    creditLimit: normalized.creditCardLimit,
    currentBalance: normalized.creditCardBalance,
    recentInquiries: normalized.recentInquiries,
    oldestAccountAgeMonths: normalized.oldestAccountAgeMonths,
    latePayments: missedPaymentHistoryToLatePayments(
      normalized.missedPaymentHistory,
    ),
  };
}

export function snapshotToLendingProfile(
  snapshot: FinancialSnapshot | null | undefined,
  fallback: LendingProfile,
): LendingProfile {
  const creditProfile = snapshotToCreditProfile(snapshot, fallback);
  const normalized = normalizeFinancialSnapshot(snapshot);

  if (!normalized) {
    return fallback;
  }

  return {
    ...fallback,
    ...creditProfile,
    estimatedMonthlyIncome: normalized.monthlyIncomeEstimate,
    monthlyDebtObligations: normalized.monthlyDebtObligations,
  };
}

function missedPaymentHistoryToLatePayments(
  range: MissedPaymentHistoryRange,
): CreditProfile["latePayments"] {
  switch (range) {
    case "none":
      return { count: 0 };
    case "one-last-12":
      return { count: 1, mostRecentMonthsAgo: 6 };
    case "more-than-one":
      return { count: 2, mostRecentMonthsAgo: 6 };
  }
}
