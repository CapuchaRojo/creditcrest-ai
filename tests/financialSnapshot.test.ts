import { describe, expect, it } from "vitest";

import { calculateUtilization } from "@/lib/creditEngine";
import { mayaLendingProfile, mayaProfile } from "@/lib/demoData";
import {
  clearFinancialSnapshot,
  financialSnapshotStorageKey,
  loadFinancialSnapshot,
  saveFinancialSnapshot,
  snapshotToCreditProfile,
  snapshotToLendingProfile,
  type FinancialSnapshot,
  type SnapshotStorage,
} from "@/lib/financialSnapshot";

class MemoryStorage implements SnapshotStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const snapshot: FinancialSnapshot = {
  firstName: "Alex",
  monthlyIncomeEstimate: 3200,
  monthlyDebtObligations: 450,
  creditCardBalance: 800,
  creditCardLimit: 2000,
  recentInquiries: 2,
  missedPaymentHistory: "more-than-one",
  oldestAccountAgeMonths: 8,
  primaryGoal: "reduce-utilization",
  updatedAt: "2026-05-30T12:00:00.000Z",
};

describe("financial snapshot", () => {
  it("converts a snapshot into the credit profile shape", () => {
    const profile = snapshotToCreditProfile(snapshot, mayaProfile);

    expect(profile.id).toBe("financial-snapshot");
    expect(profile.name).toBe("Alex");
    expect(profile.currentBalance).toBe(800);
    expect(profile.creditLimit).toBe(2000);
    expect(profile.recentInquiries).toBe(2);
    expect(profile.latePayments.count).toBe(2);
    expect(profile.oldestAccountAgeMonths).toBe(8);
    expect(profile.estimatedCreditBand).toBe("No score prediction");
  });

  it("uses Maya when no valid snapshot exists", () => {
    const storage = new MemoryStorage();

    expect(loadFinancialSnapshot(storage)).toBeNull();
    expect(snapshotToCreditProfile(null, mayaProfile)).toEqual(mayaProfile);
    expect(saveFinancialSnapshot({ firstName: "", creditCardLimit: 0 }, storage))
      .toBeNull();
    expect(storage.getItem(financialSnapshotStorageKey)).toBeNull();
  });

  it("calculates utilization from snapshot values after conversion", () => {
    const profile = snapshotToCreditProfile(snapshot, mayaProfile);

    expect(calculateUtilization(profile.currentBalance, profile.creditLimit)).toBe(
      40,
    );
  });

  it("clears the local snapshot when reset", () => {
    const storage = new MemoryStorage();

    saveFinancialSnapshot(snapshot, storage);
    expect(loadFinancialSnapshot(storage)?.firstName).toBe("Alex");

    clearFinancialSnapshot(storage);
    expect(loadFinancialSnapshot(storage)).toBeNull();
  });

  it("converts snapshot income and debt into lending defaults", () => {
    const profile = snapshotToLendingProfile(snapshot, mayaLendingProfile);

    expect(profile.estimatedMonthlyIncome).toBe(3200);
    expect(profile.monthlyDebtObligations).toBe(450);
    expect(profile.currentBalance).toBe(800);
  });
});
