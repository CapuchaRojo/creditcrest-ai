import type { CreditProfile, CreditScenario } from "@/lib/creditEngine";

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

export const prebuiltScenarios: CreditScenario[] = [
  {
    id: "buy-laptop",
    title: "Buy a $600 laptop today",
    type: "buyWithCard",
    purchaseAmount: 600,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "Maya puts a needed laptop on her current credit card.",
  },
  {
    id: "pay-300",
    title: "Pay $300 toward balance",
    type: "payDownBalance",
    paymentAmount: 300,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "Maya makes a larger payment before adding any new spending.",
  },
  {
    id: "store-card",
    title: "Apply for a store card",
    type: "applyForCard",
    newApplication: true,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "Maya considers a retail card for a checkout discount.",
  },
  {
    id: "miss-payment",
    title: "Miss this month's payment",
    type: "missPayment",
    missedPayment: true,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "Maya skips this month's due date.",
  },
  {
    id: "limit-increase",
    title: "Ask for a credit limit increase",
    type: "increaseLimit",
    creditLimitIncrease: 500,
    hardInquiry: false,
    currentBalance: mayaProfile.currentBalance,
    creditLimit: mayaProfile.creditLimit,
    description: "Maya asks whether her issuer can raise the limit with no hard pull.",
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
    description: "Maya considers financing a phone through a new account.",
  },
];

export function getScenarioById(id?: string | null) {
  return prebuiltScenarios.find((scenario) => scenario.id === id);
}
