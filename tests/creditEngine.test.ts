import { describe, expect, it } from "vitest";

import {
  calculateUtilization,
  classifyUtilizationRisk,
  generateThirtyDayPlan,
  simulateScenario,
} from "@/lib/creditEngine";
import { mayaProfile, prebuiltScenarios } from "@/lib/demoData";

describe("creditEngine", () => {
  it("calculates utilization as a rounded percentage", () => {
    expect(calculateUtilization(730, 1500)).toBe(48.7);
    expect(calculateUtilization(0, 0)).toBe(0);
    expect(calculateUtilization(100, 0)).toBe(100);
  });

  it("classifies utilization thresholds deterministically", () => {
    expect(classifyUtilizationRisk(9.9).band).toBe("Excellent");
    expect(classifyUtilizationRisk(20).band).toBe("Good");
    expect(classifyUtilizationRisk(49).level).toBe("Medium");
    expect(classifyUtilizationRisk(60).level).toBe("High");
    expect(classifyUtilizationRisk(75).level).toBe("Critical");
  });

  it("flags the laptop demo as critical utilization risk", () => {
    const laptop = prebuiltScenarios.find((scenario) => scenario.id === "buy-laptop");
    expect(laptop).toBeDefined();

    const result = simulateScenario(mayaProfile, laptop!);

    expect(result.afterBalance).toBe(1330);
    expect(result.afterUtilization).toBe(88.7);
    expect(result.riskLevel).toBe("Critical");
    expect(result.primaryFactor).toBe("utilization");
    expect(result.impactDirection).toBe("Significant risk");
  });

  it("models a $300 payment as helpful", () => {
    const payDown = prebuiltScenarios.find((scenario) => scenario.id === "pay-300");
    expect(payDown).toBeDefined();

    const result = simulateScenario(mayaProfile, payDown!);

    expect(result.afterBalance).toBe(430);
    expect(result.afterUtilization).toBe(28.7);
    expect(result.riskLevel).toBe("Low");
    expect(result.impactDirection).toBe("Helps");
  });

  it("treats missed payments as critical", () => {
    const result = simulateScenario(mayaProfile, {
      title: "Miss payment",
      type: "missPayment",
      missedPayment: true,
      currentBalance: 730,
      creditLimit: 1500,
    });

    expect(result.riskLevel).toBe("Critical");
    expect(result.primaryFactor).toBe("paymentHistory");
  });

  it("generates a 30-day plan based on Maya's utilization gap", () => {
    const plan = generateThirtyDayPlan(mayaProfile);

    expect(plan).toHaveLength(4);
    expect(plan[0].target).toContain("$280");
  });
});
