export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type CreditFactor =
  | "paymentHistory"
  | "utilization"
  | "newCredit"
  | "creditAge"
  | "creditMix";

export type ImpactDirection =
  | "Helps"
  | "Neutral"
  | "Slight risk"
  | "Significant risk";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type ScenarioType =
  | "buyWithCard"
  | "payDownBalance"
  | "applyForCard"
  | "missPayment"
  | "minimumOnly"
  | "financePurchase"
  | "increaseLimit"
  | "custom";

export type UtilizationBand =
  | "Excellent"
  | "Good"
  | "Caution"
  | "High"
  | "Critical";

export interface CreditProfile {
  id: string;
  name: string;
  age: number;
  persona: string;
  estimatedCreditBand: string;
  creditLimit: number;
  currentBalance: number;
  recentInquiries: number;
  oldestAccountAgeMonths: number;
  latePayments: {
    count: number;
    mostRecentMonthsAgo?: number;
  };
  creditMix: string[];
}

export interface CreditScenario {
  id?: string;
  title: string;
  type: ScenarioType;
  purchaseAmount?: number;
  currentBalance?: number;
  creditLimit?: number;
  paymentAmount?: number;
  newApplication?: boolean;
  missedPayment?: boolean;
  financing?: boolean;
  minimumOnly?: boolean;
  creditLimitIncrease?: number;
  hardInquiry?: boolean;
  description?: string;
}

export interface UtilizationAssessment {
  utilization: number;
  band: UtilizationBand;
  level: RiskLevel;
  note: string;
}

export interface FactorImpact {
  factor: CreditFactor;
  level: RiskLevel;
  title: string;
  detail: string;
}

export interface CreditImpactResult {
  riskLevel: RiskLevel;
  primaryFactor: CreditFactor;
  beforeUtilization: number;
  afterUtilization: number;
  beforeBalance: number;
  afterBalance: number;
  beforeLimit: number;
  afterLimit: number;
  impactDirection: ImpactDirection;
  explanation: string;
  recommendation: string;
  whyItMatters: string;
  confidence: ConfidenceLevel;
  affectedFactors: FactorImpact[];
}

export interface FactorBreakdownItem {
  factor: CreditFactor;
  label: string;
  level: RiskLevel;
  status: string;
  detail: string;
  metric: string;
}

export interface ThirtyDayPlanWeek {
  id: string;
  week: number;
  title: string;
  factor: CreditFactor;
  target: string;
  detail: string;
  actions: string[];
}

export const creditFactorLabels: Record<CreditFactor, string> = {
  paymentHistory: "Payment history",
  utilization: "Utilization",
  newCredit: "New credit / inquiries",
  creditAge: "Credit age",
  creditMix: "Credit mix",
};

const riskRank: Record<RiskLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

function roundDollars(value: number) {
  return Math.round(value * 100) / 100;
}

function clampMoney(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, roundDollars(value));
}

function strongestRisk(levels: RiskLevel[]) {
  return levels.reduce<RiskLevel>(
    (strongest, level) =>
      riskRank[level] > riskRank[strongest] ? level : strongest,
    "Low",
  );
}

export function calculateUtilization(balance: number, limit: number) {
  const safeBalance = clampMoney(balance);

  if (!Number.isFinite(limit) || limit <= 0) {
    return safeBalance > 0 ? 100 : 0;
  }

  return roundPercent((safeBalance / limit) * 100);
}

export function classifyUtilizationRisk(
  utilization: number,
): UtilizationAssessment {
  const safeUtilization = Math.max(
    0,
    Number.isFinite(utilization) ? utilization : 0,
  );

  if (safeUtilization < 10) {
    return {
      utilization: roundPercent(safeUtilization),
      band: "Excellent",
      level: "Low",
      note: "Very low card usage usually leaves room for safer credit decisions.",
    };
  }

  if (safeUtilization < 30) {
    return {
      utilization: roundPercent(safeUtilization),
      band: "Good",
      level: "Low",
      note: "This is generally a healthy utilization range for credit building.",
    };
  }

  if (safeUtilization < 50) {
    return {
      utilization: roundPercent(safeUtilization),
      band: "Caution",
      level: "Medium",
      note: "This is a caution zone where paying down balances can help.",
    };
  }

  if (safeUtilization < 75) {
    return {
      utilization: roundPercent(safeUtilization),
      band: "High",
      level: "High",
      note: "High utilization can make the profile look stretched.",
    };
  }

  return {
    utilization: roundPercent(safeUtilization),
    band: "Critical",
    level: "Critical",
    note: "Very high utilization can be one of the loudest warning signs.",
  };
}

export function simulateScenario(
  profile: CreditProfile,
  scenario: CreditScenario,
): CreditImpactResult {
  const beforeBalance = clampMoney(scenario.currentBalance ?? profile.currentBalance);
  const beforeLimit = clampMoney(scenario.creditLimit ?? profile.creditLimit);
  const purchaseAmount = clampMoney(scenario.purchaseAmount ?? 0);
  const paymentAmount = clampMoney(scenario.paymentAmount ?? 0);
  const creditLimitIncrease = clampMoney(scenario.creditLimitIncrease ?? 0);

  let afterBalance = beforeBalance;
  let afterLimit = beforeLimit;

  const isFinancing = scenario.financing || scenario.type === "financePurchase";
  const isMinimumOnly = scenario.minimumOnly || scenario.type === "minimumOnly";
  const isMissedPayment = scenario.missedPayment || scenario.type === "missPayment";
  const hasNewApplication =
    scenario.newApplication ||
    scenario.type === "applyForCard" ||
    isFinancing ||
    Boolean(scenario.hardInquiry);

  const purchaseHitsCard =
    purchaseAmount > 0 &&
    (scenario.type === "buyWithCard" ||
      (scenario.type === "custom" && !isFinancing));

  if (purchaseHitsCard) {
    afterBalance += purchaseAmount;
  }

  if (scenario.type === "payDownBalance" || paymentAmount > 0) {
    afterBalance -= paymentAmount;
  }

  if (isMinimumOnly) {
    const estimatedMinimum = Math.max(35, Math.round(beforeBalance * 0.02));
    afterBalance -= paymentAmount > 0 ? paymentAmount : estimatedMinimum;
  }

  if (creditLimitIncrease > 0) {
    afterLimit += creditLimitIncrease;
  }

  afterBalance = clampMoney(afterBalance);
  afterLimit = clampMoney(afterLimit);

  const beforeUtilization = calculateUtilization(beforeBalance, beforeLimit);
  const afterUtilization = calculateUtilization(afterBalance, afterLimit);
  const utilizationAssessment = classifyUtilizationRisk(afterUtilization);
  const beforeAssessment = classifyUtilizationRisk(beforeUtilization);
  const affectedFactors: FactorImpact[] = [];

  const utilizationChanged = Math.abs(afterUtilization - beforeUtilization) >= 0.5;
  if (
    utilizationAssessment.level !== "Low" ||
    utilizationChanged ||
    purchaseHitsCard ||
    paymentAmount > 0 ||
    creditLimitIncrease > 0
  ) {
    const moved =
      afterUtilization > beforeUtilization
        ? `increases from ${beforeUtilization}% to ${afterUtilization}%`
        : afterUtilization < beforeUtilization
          ? `improves from ${beforeUtilization}% to ${afterUtilization}%`
          : `stays at ${afterUtilization}%`;

    affectedFactors.push({
      factor: "utilization",
      level:
        afterUtilization < beforeUtilization && utilizationAssessment.level === "Low"
          ? "Low"
          : utilizationAssessment.level,
      title: `${utilizationAssessment.band} utilization`,
      detail: `Card utilization ${moved}. ${utilizationAssessment.note}`,
    });
  }

  if (isMissedPayment) {
    affectedFactors.push({
      factor: "paymentHistory",
      level: "Critical",
      title: "Missed payment warning",
      detail:
        "A missed payment can become a major negative signal if it is reported late. Avoiding it should outrank every optional purchase.",
    });
  }

  if (hasNewApplication) {
    const applicationRisk: RiskLevel =
      profile.recentInquiries > 0 || isFinancing ? "High" : "Medium";

    affectedFactors.push({
      factor: "newCredit",
      level: applicationRisk,
      title: scenario.hardInquiry
        ? "Possible hard inquiry"
        : "New credit application",
      detail:
        profile.recentInquiries > 0
          ? "This profile already has a recent inquiry, so another application adds more visible new-credit pressure."
          : "A new application may add an inquiry and a new account, which can be risky for a young file.",
    });

    affectedFactors.push({
      factor: "creditAge",
      level: "Medium",
      title: "Young account age pressure",
      detail:
        "Opening a new account can lower average account age, which matters more for early credit builders.",
    });
  }

  if (isFinancing) {
    affectedFactors.push({
      factor: "creditMix",
      level: "Medium",
      title: "Financing tradeoff",
      detail:
        "Financing may diversify credit mix later, but the near-term inquiry and new account usually matter first.",
    });
  }

  if (isMinimumOnly) {
    affectedFactors.push({
      factor: "utilization",
      level: afterUtilization >= 50 ? "High" : "Medium",
      title: "Balance persistence",
      detail:
        "Paying only the minimum keeps the balance visible for longer and may keep utilization elevated.",
    });
  }

  if (affectedFactors.length === 0) {
    affectedFactors.push({
      factor: "utilization",
      level: beforeAssessment.level,
      title: "No major modeled change",
      detail:
        "The available inputs do not create a major modeled credit factor change.",
    });
  }

  const riskLevel = strongestRisk(affectedFactors.map((impact) => impact.level));
  const primaryFactor =
    affectedFactors.find((impact) => impact.level === riskLevel)?.factor ??
    "utilization";
  const impactDirection = getImpactDirection(
    riskLevel,
    beforeUtilization,
    afterUtilization,
    isMissedPayment,
    hasNewApplication,
  );

  const baseImpact = {
    riskLevel,
    primaryFactor,
    beforeUtilization,
    afterUtilization,
    beforeBalance,
    afterBalance,
    beforeLimit,
    afterLimit,
    impactDirection,
    affectedFactors,
  };

  const impactForCopy = baseImpact as CreditImpactResult;

  return {
    ...baseImpact,
    explanation: generateExplanation(scenario, impactForCopy),
    recommendation: generateRecommendation(profile, scenario, impactForCopy),
    whyItMatters: generateWhyItMatters(primaryFactor),
    confidence: calculateConfidence(scenario),
  };
}

function getImpactDirection(
  riskLevel: RiskLevel,
  beforeUtilization: number,
  afterUtilization: number,
  missedPayment: boolean,
  hasNewApplication: boolean,
): ImpactDirection {
  if (missedPayment || riskLevel === "Critical" || riskLevel === "High") {
    return "Significant risk";
  }

  if (afterUtilization < beforeUtilization && !hasNewApplication) {
    return "Helps";
  }

  if (riskLevel === "Medium" || hasNewApplication) {
    return "Slight risk";
  }

  return "Neutral";
}

function calculateConfidence(scenario: CreditScenario): ConfidenceLevel {
  const hasCoreNumbers =
    Number.isFinite(scenario.currentBalance) && Number.isFinite(scenario.creditLimit);
  const hasActionAmount =
    Number.isFinite(scenario.purchaseAmount) ||
    Number.isFinite(scenario.paymentAmount) ||
    Number.isFinite(scenario.creditLimitIncrease) ||
    scenario.newApplication ||
    scenario.missedPayment ||
    scenario.financing;

  if (hasCoreNumbers && hasActionAmount) {
    return "High";
  }

  if (scenario.description && !hasActionAmount) {
    return "Low";
  }

  return "Medium";
}

function generateExplanation(
  scenario: CreditScenario,
  impact: CreditImpactResult,
) {
  if (scenario.missedPayment || scenario.type === "missPayment") {
    return "Missing a payment is modeled as critical because payment history is one of the most important credit-building signals.";
  }

  if (impact.afterUtilization >= 75) {
    return `This move would put the card near ${impact.afterUtilization}% utilization. That is a critical utilization zone for an early credit builder.`;
  }

  if (impact.afterUtilization >= 50) {
    return `This move would leave the card at ${impact.afterUtilization}% utilization, which is high enough to create visible risk.`;
  }

  if (scenario.newApplication || scenario.financing || scenario.hardInquiry) {
    return "The biggest modeled concern is new-credit pressure: an inquiry or new account can matter more when the file is still young.";
  }

  if (impact.afterUtilization < impact.beforeUtilization) {
    return `This improves utilization from ${impact.beforeUtilization}% to ${impact.afterUtilization}%, which supports a healthier credit-building path.`;
  }

  if (scenario.minimumOnly || scenario.type === "minimumOnly") {
    return "The payment technically helps, but the balance stays high enough that utilization may remain a problem next cycle.";
  }

  return "The modeled inputs do not create a major negative credit factor change.";
}

export function generateRecommendation(
  profile: CreditProfile,
  scenario: CreditScenario,
  impact: CreditImpactResult,
) {
  if (scenario.missedPayment || scenario.type === "missPayment") {
    return "Protect the due date first: make any affordable payment before the due date, turn on autopay, and contact the issuer before the account becomes reportable as late.";
  }

  if (impact.afterUtilization >= 75) {
    const targetBalance = Math.floor(impact.afterLimit * 0.3);
    const paydownNeeded = Math.max(0, Math.ceil(impact.afterBalance - targetBalance));

    return `Safer path: pay down the card first, split part of the purchase with debit or cash, or wait until after statement close. To get near 30% utilization after this move, the modeled balance would need to drop by about $${paydownNeeded}.`;
  }

  if (impact.afterUtilization >= 50) {
    return "Reduce the balance before adding new charges. A smaller purchase, split payment, or extra payment before statement close would lower the modeled risk.";
  }

  if (scenario.type === "minimumOnly" || scenario.minimumOnly) {
    return "Keep the account current, but choose a fixed extra payment above the minimum if possible so utilization does not stay elevated.";
  }

  if (scenario.newApplication || scenario.financing || scenario.hardInquiry) {
    return profile.recentInquiries > 0
      ? "Wait before applying again if the purchase can wait. If you proceed, compare no-credit-check or soft-pull options and avoid stacking applications."
      : "Apply only if the account solves a real need. Prefer soft-pull prequalification and avoid opening credit for a one-time discount.";
  }

  if (impact.afterUtilization < impact.beforeUtilization) {
    return "Good move. Keep the payment scheduled, avoid replacing the freed-up limit with new spending, and keep autopay active.";
  }

  if (scenario.type === "increaseLimit") {
    return "Confirm whether the limit increase uses a soft inquiry. A no-hard-inquiry increase can improve utilization without adding new balance.";
  }

  return "Keep balances low, pay on time, and avoid unnecessary applications while the file continues aging.";
}

function generateWhyItMatters(factor: CreditFactor) {
  switch (factor) {
    case "paymentHistory":
      return "Payment history is about reliability. One avoidable late payment can outweigh several smaller optimization wins.";
    case "utilization":
      return "Utilization compares card balance with credit limit. Lower visible balances usually make a credit file look less stretched.";
    case "newCredit":
      return "New applications can add inquiries and new accounts. That pressure is more noticeable on a young or thin credit file.";
    case "creditAge":
      return "Credit age rewards time. New accounts can temporarily reduce the average age of the file.";
    case "creditMix":
      return "Credit mix can help over time, but it should not require taking on unnecessary debt.";
  }
}

export function generateThirtyDayPlan(
  profile: CreditProfile,
): ThirtyDayPlanWeek[] {
  const targetThirtyPercent = Math.floor(profile.creditLimit * 0.3);
  const paydownToThirty = Math.max(0, profile.currentBalance - targetThirtyPercent);

  return [
    {
      id: "week-1-utilization",
      week: 1,
      title: "Lower visible utilization",
      factor: "utilization",
      target: `Pay at least $${paydownToThirty} to move below 30% utilization`,
      detail:
        "Bring the card balance closer to a healthier reporting range before making optional purchases.",
      actions: [
        `Schedule a $${paydownToThirty} payment if cash flow allows.`,
        "Pause non-essential card spending until the next statement closes.",
        "Use debit for daily purchases while utilization resets.",
      ],
    },
    {
      id: "week-2-payment-history",
      week: 2,
      title: "Protect every due date",
      factor: "paymentHistory",
      target: "Set autopay and one backup reminder",
      detail:
        "Maya has one late payment from 10 months ago, so the next few on-time months matter.",
      actions: [
        "Turn on autopay for at least the minimum payment.",
        "Add a calendar reminder three days before the due date.",
        "Keep payment confirmation screenshots or emails in one folder.",
      ],
    },
    {
      id: "week-3-new-credit",
      week: 3,
      title: "Avoid application stacking",
      factor: "newCredit",
      target: "No new hard inquiries this month",
      detail:
        "A young file with one recent inquiry benefits from a quiet month of no new applications.",
      actions: [
        "Skip store cards and checkout financing unless it is essential.",
        "Use soft-pull prequalification if comparing options.",
        "Write down the reason before opening any new account.",
      ],
    },
    {
      id: "week-4-review",
      week: 4,
      title: "Review and plan the next safe step",
      factor: "creditAge",
      target: "Check reports and choose one low-risk move",
      detail:
        "Credit building is a sequence. The safest next move depends on what changed this month.",
      actions: [
        "Review credit reports for errors or unfamiliar accounts.",
        "Confirm the card reported the lower balance.",
        "Choose one next action: stay steady, request a soft-pull limit increase, or keep paying down.",
      ],
    },
  ];
}

export function getFactorBreakdown(
  profile: CreditProfile,
): FactorBreakdownItem[] {
  const utilization = calculateUtilization(
    profile.currentBalance,
    profile.creditLimit,
  );
  const utilizationAssessment = classifyUtilizationRisk(utilization);
  const paymentLevel: RiskLevel =
    profile.latePayments.count === 0
      ? "Low"
      : (profile.latePayments.mostRecentMonthsAgo ?? 99) <= 12
        ? "High"
        : "Medium";
  const inquiryLevel: RiskLevel =
    profile.recentInquiries === 0
      ? "Low"
      : profile.recentInquiries === 1
        ? "Medium"
        : "High";
  const ageLevel: RiskLevel =
    profile.oldestAccountAgeMonths < 12
      ? "High"
      : profile.oldestAccountAgeMonths < 24
        ? "Medium"
        : "Low";
  const mixLevel: RiskLevel = profile.creditMix.length >= 2 ? "Low" : "Medium";

  return [
    {
      factor: "paymentHistory",
      label: creditFactorLabels.paymentHistory,
      level: paymentLevel,
      status:
        profile.latePayments.count === 0
          ? "Clean recent history"
          : "Rebuilding after a late payment",
      detail:
        profile.latePayments.count === 0
          ? "No late payments are modeled in this synthetic profile."
          : `${profile.latePayments.count} late payment modeled ${profile.latePayments.mostRecentMonthsAgo} months ago.`,
      metric:
        profile.latePayments.count === 0
          ? "0 late payments"
          : `${profile.latePayments.count} late / ${profile.latePayments.mostRecentMonthsAgo} mo ago`,
    },
    {
      factor: "utilization",
      label: creditFactorLabels.utilization,
      level: utilizationAssessment.level,
      status: `${utilizationAssessment.band} zone`,
      detail: utilizationAssessment.note,
      metric: `${Math.round(utilization)}% used`,
    },
    {
      factor: "newCredit",
      label: creditFactorLabels.newCredit,
      level: inquiryLevel,
      status:
        profile.recentInquiries === 0
          ? "Quiet application history"
          : "Recent inquiry visible",
      detail:
        "Additional applications can add pressure while Maya's credit file is still young.",
      metric: `${profile.recentInquiries} recent inquiry`,
    },
    {
      factor: "creditAge",
      label: creditFactorLabels.creditAge,
      level: ageLevel,
      status: "Young but aging",
      detail:
        "The oldest account is still new enough that opening accounts should be deliberate.",
      metric: `${profile.oldestAccountAgeMonths} months`,
    },
    {
      factor: "creditMix",
      label: creditFactorLabels.creditMix,
      level: mixLevel,
      status: profile.creditMix.length >= 2 ? "Some mix" : "Limited mix",
      detail:
        "Mix can improve naturally over time; it is not a reason to take on debt by itself.",
      metric: profile.creditMix.join(", "),
    },
  ];
}
