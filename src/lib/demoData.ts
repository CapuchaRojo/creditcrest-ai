import type { CreditProfile, CreditScenario } from "@/lib/creditEngine";
import type { LendingProfile, SyntheticLoanOffer } from "@/lib/lendingEngine";

export const mayaProfile: CreditProfile = {
  id: "maya",
  name: "Maya",
  age: 22,
  persona: "Student / early credit builder",
  estimatedCreditBand: "620-660",
  creditLimit: 1500,
  currentBalance: 730,
  recentInquiries: 1,
  oldestAccountAgeMonths: 14,
  latePayments: {
    count: 1,
    mostRecentMonthsAgo: 10,
  },
  creditMix: ["Credit card"],
};

export const mayaLendingProfile: LendingProfile = {
  ...mayaProfile,
  estimatedMonthlyIncome: 2400,
};

export const syntheticLoanOffers: SyntheticLoanOffer[] = [
  {
    id: "crest-starter",
    name: "Crest Starter",
    purpose: "Laptop or phone financing",
    principal: 800,
    annualApr: 18,
    termMonths: 12,
    hardInquiry: true,
    newAccount: true,
    positioning: "Balanced starter installment option",
  },
  {
    id: "crest-builder-secured",
    name: "Crest Builder Secured",
    purpose: "Credit-builder loan",
    principal: 500,
    annualApr: 9,
    termMonths: 12,
    hardInquiry: false,
    newAccount: true,
    requiresDeposit: true,
    positioning: "Lower-risk education-first builder path",
  },
  {
    id: "crest-fastcash",
    name: "Crest FastCash",
    purpose: "Emergency cash",
    principal: 800,
    annualApr: 36,
    termMonths: 6,
    hardInquiry: true,
    newAccount: true,
    positioning: "High-cost short-term option",
  },
  {
    id: "crest-flex-plan",
    name: "Crest Flex Plan",
    purpose: "Purchase split plan",
    principal: 600,
    annualApr: 0,
    termMonths: 4,
    hardInquiry: false,
    newAccount: false,
    positioning: "Lower cost path that still requires payment discipline",
  },
];

export const prebuiltScenarios: CreditScenario[] = [
  {
    id: "buy-laptop",
    title: "Buy a $600 laptop today",
    type: "buyWithCard",
    purchaseAmount: 600,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "The learner puts a needed laptop on the current credit card.",
  },
  {
    id: "pay-300",
    title: "Pay $300 toward balance",
    type: "payDownBalance",
    paymentAmount: 300,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "The learner makes a larger payment before adding new spending.",
  },
  {
    id: "store-card",
    title: "Apply for a store card",
    type: "applyForCard",
    newApplication: true,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "The learner considers a retail card for a checkout discount.",
  },
  {
    id: "miss-payment",
    title: "Miss this month's payment",
    type: "missPayment",
    missedPayment: true,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "The learner skips this month's due date.",
  },
  {
    id: "limit-increase",
    title: "Ask for a credit limit increase",
    type: "increaseLimit",
    creditLimitIncrease: 500,
    hardInquiry: false,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "The learner asks whether the issuer can raise the limit with no hard pull.",
  },
  {
    id: "finance-phone",
    title: "Finance a phone",
    type: "financePurchase",
    purchaseAmount: 900,
    financing: true,
    newApplication: true,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description:
      "The learner considers financing a phone. Lending Lab compares synthetic EMI, APR, and approval-readiness paths.",
  },
];

export function getScenarioById(id?: string | null) {
  return prebuiltScenarios.find((scenario) => scenario.id === id);
}
