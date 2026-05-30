import { describe, expect, it } from "vitest";

import {
  calculateCreditLimitImpact,
  calculateApprovalReadiness,
  calculateEmi,
  calculateEmiScenario,
  calculatePaymentBurdenScenario,
  calculatePaymentBurden,
  calculateUtilizationPaydown,
  classifyPaymentBurden,
  compareAprOptions,
  simulateLoanOffer,
} from "@/lib/lendingEngine";
import { mayaLendingProfile, syntheticLoanOffers } from "@/lib/demoData";

const riskRank = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function offer(id: string) {
  const match = syntheticLoanOffers.find((loanOffer) => loanOffer.id === id);
  if (!match) {
    throw new Error(`Missing test offer ${id}`);
  }
  return match;
}

describe("lendingEngine", () => {
  it("calculates 0% APR EMI", () => {
    expect(calculateEmi(600, 0, 4)).toBe(150);
  });

  it("calculates 18% APR EMI", () => {
    expect(calculateEmi(800, 18, 12)).toBeCloseTo(73.34, 1);
  });

  it("classifies payment burden thresholds", () => {
    expect(calculatePaymentBurden(120, 2400)).toBe(5);
    expect(classifyPaymentBurden(5)).toBe("Low");
    expect(classifyPaymentBurden(5.1)).toBe("Medium");
    expect(classifyPaymentBurden(10.1)).toBe("High");
    expect(classifyPaymentBurden(16)).toBe("Critical");
  });

  it("reduces approval-readiness when utilization is high", () => {
    const builder = offer("crest-builder-secured");
    const normalReadiness = calculateApprovalReadiness(
      mayaLendingProfile,
      builder,
    );
    const highUtilizationReadiness = calculateApprovalReadiness(
      {
        ...mayaLendingProfile,
        currentBalance: 1225,
      },
      builder,
    );

    expect(highUtilizationReadiness.score).toBeLessThan(normalReadiness.score);
    expect(highUtilizationReadiness.status).not.toBe("Likely ready");
  });

  it("flags FastCash as higher risk than Builder Secured", () => {
    const builderResult = simulateLoanOffer(
      mayaLendingProfile,
      offer("crest-builder-secured"),
    );
    const fastCashResult = simulateLoanOffer(
      mayaLendingProfile,
      offer("crest-fastcash"),
    );

    expect(riskRank[fastCashResult.riskLevel]).toBeGreaterThan(
      riskRank[builderResult.riskLevel],
    );
  });

  it("builds a timeline with today, month 1, month 3, and month 6", () => {
    const result = simulateLoanOffer(mayaLendingProfile, offer("crest-fastcash"));
    const labels = result.timeline.map((item) => item.label);

    expect(labels).toEqual(["Today", "Month 1", "Month 3", "Month 6"]);
  });

  it("unlocks APR, EMI, and payment history concepts", () => {
    const result = simulateLoanOffer(mayaLendingProfile, offer("crest-starter"));
    const concepts = result.educationUnlocks.map((unlock) => unlock.concept);

    expect(concepts).toContain("EMI / monthly payment");
    expect(concepts).toContain("APR and total repayment");
    expect(concepts).toContain("Payment history");
  });

  it("calculates EMI scenario with down payment", () => {
    const result = calculateEmiScenario({
      principal: 1000,
      annualApr: 12,
      termMonths: 10,
      downPayment: 200,
    });

    expect(result.financedPrincipal).toBe(800);
    expect(result.monthlyPayment).toBeGreaterThan(80);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("calculates utilization paydown target", () => {
    const result = calculateUtilizationPaydown(730, 1500, 30);

    expect(result.amountNeeded).toBe(280);
    expect(result.beforeUtilization).toBe(48.7);
    expect(result.afterUtilization).toBe(30);
    expect(result.beforeRisk).toBe("Medium");
  });

  it("compares APR options deterministically", () => {
    const comparison = compareAprOptions(
      {
        name: "Lower APR",
        principal: 800,
        annualApr: 9,
        termMonths: 12,
      },
      {
        name: "Higher APR",
        principal: 800,
        annualApr: 36,
        termMonths: 12,
      },
    );

    expect(comparison.optionB.totalInterest).toBeGreaterThan(
      comparison.optionA.totalInterest,
    );
    expect(comparison.totalInterestDifference).toBeGreaterThan(0);
  });

  it("returns payment burden warning for high burden", () => {
    const result = calculatePaymentBurdenScenario(300, 2400);

    expect(result.paymentBurdenPercent).toBe(12.5);
    expect(result.paymentBurdenRisk).toBe("High");
    expect(result.warning).toContain("High payment burden");
  });

  it("calculates credit limit impact", () => {
    const result = calculateCreditLimitImpact(730, 1500, 2500);

    expect(result.beforeUtilization).toBe(48.7);
    expect(result.afterUtilization).toBe(29.2);
    expect(result.afterRisk).toBe("Low");
    expect(result.explanation).toContain("hard inquiry");
  });
});
