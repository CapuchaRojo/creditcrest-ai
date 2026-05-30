import {
  calculateUtilization,
  classifyUtilizationRisk,
  type CreditProfile,
  type DecisionTraceStep,
  type FactorImpact,
  type RiskLevel,
} from "@/lib/creditEngine";

export type LoanPurpose =
  | "Laptop or phone financing"
  | "Credit-builder loan"
  | "Emergency cash"
  | "Purchase split plan";

export type PaymentBurdenRisk = RiskLevel;

export type ApprovalReadiness =
  | "Likely ready"
  | "Needs caution"
  | "Not ready yet";

export interface SyntheticLoanOffer {
  id: string;
  name: string;
  purpose: LoanPurpose;
  principal: number;
  annualApr: number;
  termMonths: number;
  hardInquiry: boolean;
  newAccount: boolean;
  requiresDeposit?: boolean;
  positioning: string;
}

export interface LendingProfile extends CreditProfile {
  estimatedMonthlyIncome: number;
}

export interface LoanSimulationInput {
  profile: LendingProfile;
  offer: SyntheticLoanOffer;
}

export interface ApprovalReadinessAssessment {
  status: ApprovalReadiness;
  score: number;
  reasons: string[];
  strengths: string[];
}

export interface EducationUnlock {
  id: string;
  title: string;
  concept: string;
  detail: string;
}

export interface LoanTimelineItem {
  id: string;
  label: string;
  title: string;
  detail: string;
  status: "Now" | "Watch" | "Milestone" | "Complete";
}

export interface LoanSimulationResult {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  paymentBurdenPercent: number;
  paymentBurdenRisk: PaymentBurdenRisk;
  approvalReadiness: ApprovalReadiness;
  approvalReadinessScore: number;
  approvalReadinessReasons: string[];
  approvalReadinessStrengths: string[];
  riskLevel: RiskLevel;
  affectedFactors: FactorImpact[];
  explanation: string;
  recommendedAlternative: string;
  decisionTrace: DecisionTraceStep[];
  educationUnlocks: EducationUnlock[];
  timeline: LoanTimelineItem[];
}

export interface EmiCalculatorInput {
  principal: number;
  annualApr: number;
  termMonths: number;
  downPayment: number;
}

export interface EmiCalculatorResult {
  financedPrincipal: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
}

export interface UtilizationPaydownResult {
  currentBalance: number;
  creditLimit: number;
  targetUtilization: number;
  amountNeeded: number;
  beforeUtilization: number;
  afterUtilization: number;
  beforeRisk: RiskLevel;
  afterRisk: RiskLevel;
}

export interface AprComparisonOption {
  name: string;
  principal: number;
  annualApr: number;
  termMonths: number;
  downPayment?: number;
}

export interface AprComparisonResult {
  optionA: AprComparisonOption & EmiCalculatorResult;
  optionB: AprComparisonOption & EmiCalculatorResult;
  monthlyPaymentDifference: number;
  totalRepaymentDifference: number;
  totalInterestDifference: number;
}

export interface PaymentBurdenCalculatorResult {
  monthlyPayment: number;
  syntheticMonthlyIncome: number;
  paymentBurdenPercent: number;
  paymentBurdenRisk: PaymentBurdenRisk;
  warning: string;
}

export interface CreditLimitImpactResult {
  currentBalance: number;
  currentLimit: number;
  proposedNewLimit: number;
  beforeUtilization: number;
  afterUtilization: number;
  beforeRisk: RiskLevel;
  afterRisk: RiskLevel;
  explanation: string;
}

const riskRank: Record<RiskLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function strongestRisk(levels: RiskLevel[]) {
  return levels.reduce<RiskLevel>(
    (strongest, level) =>
      riskRank[level] > riskRank[strongest] ? level : strongest,
    "Low",
  );
}

export function calculateEmi(
  principal: number,
  annualApr: number,
  months: number,
) {
  if (months <= 0 || principal <= 0) {
    return 0;
  }

  if (annualApr <= 0) {
    return roundMoney(principal / months);
  }

  const monthlyRate = annualApr / 100 / 12;
  const payment =
    (principal * monthlyRate * (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1);

  return roundMoney(payment);
}

export function calculateEmiScenario(
  input: EmiCalculatorInput,
): EmiCalculatorResult {
  const financedPrincipal = roundMoney(
    Math.max(input.principal - input.downPayment, 0),
  );
  const monthlyPayment = calculateEmi(
    financedPrincipal,
    input.annualApr,
    input.termMonths,
  );
  const totalRepayment = calculateTotalRepayment(
    monthlyPayment,
    input.termMonths,
  );
  const totalInterest = calculateTotalInterest(
    totalRepayment,
    financedPrincipal,
  );

  return {
    financedPrincipal,
    monthlyPayment,
    totalRepayment,
    totalInterest,
  };
}

export function calculateTotalRepayment(
  monthlyPayment: number,
  months: number,
) {
  return roundMoney(monthlyPayment * months);
}

export function calculateTotalInterest(
  totalRepayment: number,
  principal: number,
) {
  return roundMoney(Math.max(totalRepayment - principal, 0));
}

export function calculatePaymentBurden(
  monthlyPayment: number,
  estimatedMonthlyIncome: number,
) {
  if (estimatedMonthlyIncome <= 0) {
    return 100;
  }

  return roundPercent((monthlyPayment / estimatedMonthlyIncome) * 100);
}

export function classifyPaymentBurden(burden: number): PaymentBurdenRisk {
  if (burden <= 5) {
    return "Low";
  }

  if (burden <= 10) {
    return "Medium";
  }

  if (burden <= 15) {
    return "High";
  }

  return "Critical";
}

export function calculateUtilizationPaydown(
  currentBalance: number,
  creditLimit: number,
  targetUtilization: number,
): UtilizationPaydownResult {
  const safeTarget = Math.max(0, Math.min(targetUtilization, 100));
  const beforeUtilization = calculateUtilization(currentBalance, creditLimit);
  const targetBalance = Math.max(0, (creditLimit * safeTarget) / 100);
  const amountNeeded = roundMoney(Math.max(currentBalance - targetBalance, 0));
  const afterBalance = roundMoney(Math.max(currentBalance - amountNeeded, 0));
  const afterUtilization = calculateUtilization(afterBalance, creditLimit);

  return {
    currentBalance: roundMoney(currentBalance),
    creditLimit: roundMoney(creditLimit),
    targetUtilization: safeTarget,
    amountNeeded,
    beforeUtilization,
    afterUtilization,
    beforeRisk: classifyUtilizationRisk(beforeUtilization).level,
    afterRisk: classifyUtilizationRisk(afterUtilization).level,
  };
}

export function compareAprOptions(
  optionA: AprComparisonOption,
  optionB: AprComparisonOption,
): AprComparisonResult {
  const resultA = calculateEmiScenario({
    principal: optionA.principal,
    annualApr: optionA.annualApr,
    termMonths: optionA.termMonths,
    downPayment: optionA.downPayment ?? 0,
  });
  const resultB = calculateEmiScenario({
    principal: optionB.principal,
    annualApr: optionB.annualApr,
    termMonths: optionB.termMonths,
    downPayment: optionB.downPayment ?? 0,
  });

  return {
    optionA: { ...optionA, ...resultA },
    optionB: { ...optionB, ...resultB },
    monthlyPaymentDifference: roundMoney(
      resultB.monthlyPayment - resultA.monthlyPayment,
    ),
    totalRepaymentDifference: roundMoney(
      resultB.totalRepayment - resultA.totalRepayment,
    ),
    totalInterestDifference: roundMoney(
      resultB.totalInterest - resultA.totalInterest,
    ),
  };
}

export function calculatePaymentBurdenScenario(
  monthlyPayment: number,
  syntheticMonthlyIncome: number,
): PaymentBurdenCalculatorResult {
  const paymentBurdenPercent = calculatePaymentBurden(
    monthlyPayment,
    syntheticMonthlyIncome,
  );
  const paymentBurdenRisk = classifyPaymentBurden(paymentBurdenPercent);
  const warning =
    paymentBurdenRisk === "High" || paymentBurdenRisk === "Critical"
      ? "High payment burden can make missed payments more likely. This is an educational warning, not financial advice."
      : paymentBurdenRisk === "Medium"
        ? "This burden deserves caution and a budget check before taking on a new obligation."
        : "This modeled burden is lower, but payment discipline still matters.";

  return {
    monthlyPayment: roundMoney(monthlyPayment),
    syntheticMonthlyIncome: roundMoney(syntheticMonthlyIncome),
    paymentBurdenPercent,
    paymentBurdenRisk,
    warning,
  };
}

export function calculateCreditLimitImpact(
  currentBalance: number,
  currentLimit: number,
  proposedNewLimit: number,
): CreditLimitImpactResult {
  const beforeUtilization = calculateUtilization(currentBalance, currentLimit);
  const afterUtilization = calculateUtilization(currentBalance, proposedNewLimit);
  const beforeRisk = classifyUtilizationRisk(beforeUtilization).level;
  const afterRisk = classifyUtilizationRisk(afterUtilization).level;
  const explanation =
    proposedNewLimit > currentLimit
      ? "A higher credit limit can lower utilization if the balance stays the same, but the lender may use a hard inquiry depending on its process."
      : "A lower or unchanged limit does not improve utilization and may increase pressure if balances stay the same.";

  return {
    currentBalance: roundMoney(currentBalance),
    currentLimit: roundMoney(currentLimit),
    proposedNewLimit: roundMoney(proposedNewLimit),
    beforeUtilization,
    afterUtilization,
    beforeRisk,
    afterRisk,
    explanation,
  };
}

export function calculateApprovalReadiness(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
): ApprovalReadinessAssessment {
  const monthlyPayment = calculateEmi(
    offer.principal,
    offer.annualApr,
    offer.termMonths,
  );
  const paymentBurdenPercent = calculatePaymentBurden(
    monthlyPayment,
    profile.estimatedMonthlyIncome,
  );
  const utilization = calculateUtilization(
    profile.currentBalance,
    profile.creditLimit,
  );
  const reasons: string[] = [];
  const strengths: string[] = [];
  let score = 82;

  if (utilization >= 75) {
    score -= 28;
    reasons.push("Utilization above 75% strongly reduces readiness.");
  } else if (utilization > 50) {
    score -= 18;
    reasons.push("Utilization above 50% adds readiness caution.");
  } else if (utilization >= 30) {
    score -= 8;
    reasons.push("Utilization is still above the preferred 30% zone.");
  } else {
    strengths.push("Utilization is below 30% in this synthetic profile.");
  }

  if (profile.recentInquiries > 0) {
    score -= Math.min(profile.recentInquiries * 8, 20);
    reasons.push("Recent inquiries make another credit action more sensitive.");
  }

  if (profile.latePayments.count > 0) {
    score -= 12;
    reasons.push("Past missed payment history adds caution.");
  }

  if (paymentBurdenPercent > 10) {
    score -= 24;
    reasons.push("Payment burden over 10% is high risk.");
  } else if (paymentBurdenPercent > 5) {
    score -= 12;
    reasons.push("Payment burden over 5% deserves caution.");
  } else {
    strengths.push("Estimated monthly payment is under 5% of synthetic income.");
  }

  if (offer.hardInquiry) {
    score -= 8;
    reasons.push("A hard inquiry may add new-credit pressure.");
  } else {
    strengths.push("No hard inquiry is modeled for this synthetic offer.");
  }

  if (offer.requiresDeposit) {
    score += 10;
    strengths.push("Secured builder structure lowers modeled readiness risk.");
  }

  if (offer.annualApr >= 30) {
    score -= 18;
    reasons.push("High APR increases the cost and caution level.");
  }

  if (offer.annualApr === 0 && !offer.hardInquiry && !offer.newAccount) {
    score += 8;
    strengths.push("0% APR with no inquiry keeps modeled credit pressure lower.");
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const status: ApprovalReadiness =
    boundedScore >= 72
      ? "Likely ready"
      : boundedScore >= 48
        ? "Needs caution"
        : "Not ready yet";

  return {
    status,
    score: boundedScore,
    reasons,
    strengths,
  };
}

export function simulateLoanOffer(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
): LoanSimulationResult {
  const monthlyPayment = calculateEmi(
    offer.principal,
    offer.annualApr,
    offer.termMonths,
  );
  const totalRepayment = calculateTotalRepayment(
    monthlyPayment,
    offer.termMonths,
  );
  const totalInterest = calculateTotalInterest(totalRepayment, offer.principal);
  const paymentBurdenPercent = calculatePaymentBurden(
    monthlyPayment,
    profile.estimatedMonthlyIncome,
  );
  const paymentBurdenRisk = classifyPaymentBurden(paymentBurdenPercent);
  const readiness = calculateApprovalReadiness(profile, offer);
  const utilization = calculateUtilization(
    profile.currentBalance,
    profile.creditLimit,
  );
  const utilizationAssessment = classifyUtilizationRisk(utilization);
  const affectedFactors = buildAffectedFactors(
    profile,
    offer,
    paymentBurdenRisk,
    utilizationAssessment.level,
  );
  const riskLevel = strongestRisk(affectedFactors.map((factor) => factor.level));
  const resultBase = {
    monthlyPayment,
    totalRepayment,
    totalInterest,
    paymentBurdenPercent,
    paymentBurdenRisk,
    approvalReadiness: readiness.status,
    approvalReadinessScore: readiness.score,
    approvalReadinessReasons: readiness.reasons,
    approvalReadinessStrengths: readiness.strengths,
    riskLevel,
    affectedFactors,
  };
  const timeline = generateLoanTimeline(profile, offer, resultBase);
  const resultForCopy = {
    ...resultBase,
    explanation: "",
    recommendedAlternative: "",
    decisionTrace: [],
    educationUnlocks: [],
    timeline,
  } satisfies LoanSimulationResult;

  return {
    ...resultBase,
    explanation: generateLoanExplanation(profile, offer, resultForCopy),
    recommendedAlternative: generateLoanAlternative(offer, resultForCopy),
    decisionTrace: generateLoanDecisionTrace(profile, offer, resultForCopy),
    educationUnlocks: generateEducationUnlocks(resultForCopy),
    timeline,
  };
}

function buildAffectedFactors(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
  paymentBurdenRisk: PaymentBurdenRisk,
  utilizationRisk: RiskLevel,
): FactorImpact[] {
  const factors: FactorImpact[] = [
    {
      factor: "utilization",
      level: utilizationRisk,
      title: "Current utilization context",
      detail:
        "Borrowing readiness starts from the existing card utilization profile before any new account is considered.",
    },
    {
      factor: "paymentHistory",
      level: profile.latePayments.count > 0 ? "Medium" : "Low",
      title: "Payment history caution",
      detail:
        profile.latePayments.count > 0
          ? "The synthetic profile includes a prior late payment, so payment discipline matters more."
          : "No missed payments are modeled in this synthetic profile.",
    },
    {
      factor: "newCredit",
      level:
        offer.hardInquiry && profile.recentInquiries > 0
          ? "High"
          : offer.hardInquiry || offer.newAccount
            ? "Medium"
            : "Low",
      title: offer.hardInquiry ? "Hard inquiry modeled" : "No hard inquiry",
      detail: offer.hardInquiry
        ? "This simulated path may add new-credit pressure because a hard inquiry is modeled."
        : "This simulated path does not model a hard inquiry.",
    },
    {
      factor: "creditMix",
      level: offer.newAccount ? "Medium" : "Low",
      title: offer.newAccount ? "New account tradeoff" : "No new account",
      detail: offer.newAccount
        ? "A new installment account may change credit mix over time, but it also adds a new obligation."
        : "No new account is modeled, so credit mix pressure is lower.",
    },
  ];

  if (paymentBurdenRisk !== "Low") {
    factors.push({
      factor: "paymentHistory",
      level: paymentBurdenRisk,
      title: "Payment burden",
      detail:
        "Higher monthly burden increases the risk of missed payments and cash-flow stress.",
    });
  }

  if (offer.annualApr >= 30) {
    factors.push({
      factor: "newCredit",
      level: "High",
      title: "High-cost borrowing warning",
      detail:
        "The APR is high enough that the educational simulator flags this as a costly short-term path.",
    });
  }

  if (offer.requiresDeposit) {
    factors.push({
      factor: "creditMix",
      level: "Low",
      title: "Secured builder structure",
      detail:
        "The deposit requirement makes this a lower-risk educational builder path in the model, not a guaranteed approval.",
    });
  }

  return factors;
}

function generateLoanExplanation(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
  result: LoanSimulationResult,
) {
  const utilization = calculateUtilization(
    profile.currentBalance,
    profile.creditLimit,
  );

  if (offer.annualApr >= 30) {
    return `${offer.name} is modeled as a high-cost short-term option. The monthly payment is ${result.paymentBurdenPercent}% of Maya's synthetic monthly income, and the APR increases total repayment pressure.`;
  }

  if (offer.requiresDeposit) {
    return `${offer.name} is modeled as an education-first secured builder path. It still creates a new account, but no hard inquiry is modeled and the payment burden stays relatively low.`;
  }

  if (offer.annualApr === 0 && !offer.hardInquiry && !offer.newAccount) {
    return `${offer.name} keeps borrowing cost low with 0% APR and no modeled inquiry, but missed payments would still create payment-history risk.`;
  }

  return `${offer.name} creates a simulated monthly payment while Maya already has ${Math.round(utilization)}% utilization and one recent inquiry, so readiness depends on payment burden and new-credit pressure.`;
}

function generateLoanAlternative(
  offer: SyntheticLoanOffer,
  result: LoanSimulationResult,
) {
  if (offer.annualApr >= 30 || result.paymentBurdenRisk === "High") {
    return "Safer educational path: compare the secured builder option, split the purchase into a lower-cost plan, or delay borrowing until the balance is lower.";
  }

  if (offer.requiresDeposit) {
    return "Keep this as a learning-first option: confirm it is simulated only, preserve emergency cash, and compare the payment against the 30-day plan.";
  }

  if (offer.annualApr === 0) {
    return "Use the plan only if each payment is already budgeted. A 0% APR path can still become risky if a missed payment occurs.";
  }

  return "Consider paying down the card first or comparing the secured builder path before adding a new hard inquiry.";
}

function generateLoanDecisionTrace(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
  result: LoanSimulationResult,
): DecisionTraceStep[] {
  return [
    {
      label: "Synthetic offer",
      detail: `${offer.name}: ${formatDollars(offer.principal)} principal, ${offer.annualApr}% APR, ${offer.termMonths} months.`,
    },
    {
      label: "EMI calculation",
      detail: `${formatDollars(offer.principal)} over ${offer.termMonths} months at ${offer.annualApr}% APR = $${result.monthlyPayment.toFixed(2)} estimated monthly payment.`,
    },
    {
      label: "Total cost",
      detail: `$${result.monthlyPayment.toFixed(2)} x ${offer.termMonths} months = $${result.totalRepayment.toFixed(2)} total repayment, including $${result.totalInterest.toFixed(2)} estimated interest.`,
    },
    {
      label: "Payment burden",
      detail: `$${result.monthlyPayment.toFixed(2)} / ${formatDollars(profile.estimatedMonthlyIncome)} synthetic monthly income = ${result.paymentBurdenPercent}% burden.`,
    },
    {
      label: "Readiness rules",
      detail: `${result.approvalReadiness} comes from utilization, inquiries, payment history, payment burden, and offer structure. It is not an approval or denial.`,
    },
  ];
}

export function generateLoanTimeline(
  profile: LendingProfile,
  offer: SyntheticLoanOffer,
  result: Pick<
    LoanSimulationResult,
    | "monthlyPayment"
    | "totalInterest"
    | "paymentBurdenRisk"
    | "approvalReadiness"
  >,
): LoanTimelineItem[] {
  const items: LoanTimelineItem[] = [
    {
      id: "today",
      label: "Today",
      title: "Compare before signing",
      detail: `${profile.name} compares ${offer.name} as a simulation only. No lender matching, no approval decision, and no sensitive identifiers are collected.`,
      status: "Now",
    },
    {
      id: "month-1",
      label: "Month 1",
      title: "First payment habit forms",
      detail: `$${result.monthlyPayment.toFixed(2)} payment is due in the model. On-time behavior protects payment history.`,
      status: "Watch",
    },
  ];

  if (offer.termMonths >= 3) {
    items.push({
      id: "month-3",
      label: "Month 3",
      title: "Balance trend becomes visible",
      detail:
        result.paymentBurdenRisk === "Low"
          ? "Payment burden remains lower in the model, so the focus is consistency."
          : "Payment burden still needs attention so one missed payment does not undo progress.",
      status: "Milestone",
    });
  }

  if (offer.termMonths >= 6) {
    items.push({
      id: "month-6",
      label: "Month 6",
      title:
        offer.termMonths === 6 ? "Simulated payoff checkpoint" : "Midpoint review",
      detail:
        offer.termMonths === 6
          ? `The short-term option reaches completion with $${result.totalInterest.toFixed(2)} estimated interest.`
          : "Review whether the new account is still helping the education plan or creating stress.",
      status: offer.termMonths === 6 ? "Complete" : "Milestone",
    });
  }

  if (offer.termMonths !== 6) {
    items.push({
      id: "completion",
      label: `Month ${offer.termMonths}`,
      title: "Completion checkpoint",
      detail: `${result.approvalReadiness} is an educational readiness label, not a guaranteed lending outcome.`,
      status: "Complete",
    });
  }

  return items;
}

export function generateEducationUnlocks(
  result: Pick<
    LoanSimulationResult,
    "paymentBurdenRisk" | "totalInterest" | "riskLevel"
  >,
): EducationUnlock[] {
  const unlocks: EducationUnlock[] = [
    {
      id: "emi",
      title: "EMI unlocked",
      concept: "EMI / monthly payment",
      detail:
        "EMI is the recurring monthly payment estimate. It helps compare affordability before borrowing.",
    },
    {
      id: "apr",
      title: "APR unlocked",
      concept: "APR and total repayment",
      detail:
        "APR helps show borrowing cost. Two offers with the same principal can have very different total repayment.",
    },
    {
      id: "payment-history",
      title: "Payment history unlocked",
      concept: "Payment history",
      detail:
        "A loan can only help an educational credit path if payments stay on time. Missed payments can dominate other benefits.",
    },
  ];

  if (result.paymentBurdenRisk !== "Low") {
    unlocks.push({
      id: "payment-burden",
      title: "Burden check unlocked",
      concept: "Payment burden",
      detail:
        "Payment burden compares the monthly payment with synthetic income to reveal cash-flow stress.",
    });
  }

  if (result.totalInterest > 50 || result.riskLevel === "High") {
    unlocks.push({
      id: "high-cost",
      title: "High-cost warning unlocked",
      concept: "Cost of credit",
      detail:
        "Shorter or higher-APR loans can look fast but still create meaningful total interest and repayment pressure.",
    });
  }

  return unlocks;
}
