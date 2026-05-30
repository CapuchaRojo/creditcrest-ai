# CreditCrest AI

## Live Demo

[Launch CreditCrest AI](https://creditcrest-ai.vercel.app/)

**Know the credit impact before you make the move.**

CreditCrest AI is a production-oriented educational prototype: a consumer credit simulator that helps early credit builders understand how purchases, payments, applications, financing, utilization changes, missed payments, and synthetic borrowing paths may affect their credit-building behavior.

It does **not** calculate an official credit score and does **not** provide financial advice. It uses synthetic demo data and deterministic educational rules.

## Problem

Most credit apps explain what already happened after a statement closes, an inquiry appears, or a missed payment is reported. Students and early credit builders often need guidance before they make a decision.

## Solution

CreditCrest AI gives users a fast simulator that models the likely directional credit impact of a decision before they act. The guided demo focuses on Maya, a synthetic 22-year-old student profile with 49% utilization, one recent inquiry, a young credit file, one late payment from 10 months ago, and synthetic monthly income of $2,400 for lending simulations.

## Features

- Mobile-first dashboard for the Maya synthetic profile
- Health summary across payment history, utilization, new credit, credit age, and credit mix
- Recharts utilization visualization
- Decision simulator with live inputs and deterministic recommendations
- Lending Lab synthetic loan marketplace
- Calculator Hub for credit, lending, financing, and borrowing education
- EMI / APR / total repayment modeling
- Utilization paydown, APR comparison, payment burden, and credit limit impact calculators
- Approval-readiness meter for educational borrowing paths
- Borrower timeline and education unlocks
- Scenario library with one-click demo scenarios
- 30-day credit builder plan with local checklist progress
- About / compliance / methodology page
- Clear educational disclaimers and no sensitive-data collection
- Unit tests for the credit and lending rules engines

## Product Ecosystem

- **CreditCrest AI** teaches and simulates consumer credit decisions with synthetic data, directional impact labels, and deterministic rules.
- **CrestLend** handles the simulated lending journey inside Lending Lab: synthetic offers, EMI modeling, approval-readiness, and borrower timelines.
- CrestLend app surface: [Open Lending Lab](https://creditcrest-ai.vercel.app/lending-lab).

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React icons
- Vitest
- Local deterministic rules engines
- Synthetic data and browser localStorage only

## Engineering Notes

- Deterministic TypeScript rules engine
- Separated business logic and UI
- Synthetic data only
- Vitest tests
- Passed lint, typecheck, tests, and production build
- Deployed on Vercel: [creditcrest-ai.vercel.app](https://creditcrest-ai.vercel.app/)

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Run checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Guided Demo Script

1. Open dashboard for Maya.
2. Show 49% utilization.
3. Click "Buy a $600 laptop today" and show Critical risk.
4. Click "Pay $300 toward balance" and show utilization improves.
5. Open Lending Lab.
6. Compare Crest Starter vs Crest Builder Secured vs Crest FastCash.
7. Show EMI/monthly payment, total repayment, approval-readiness, and borrower timeline.
8. Emphasize: "CreditCrest AI turns borrowing into a transparent educational simulation before the user signs."

## Architecture Overview

```text
src/
  app/
    page.tsx              Dashboard
    lending-lab/page.tsx  Synthetic lending simulator
    calculator-hub/page.tsx
    simulator/page.tsx    Interactive decision simulator
    plan/page.tsx         30-day builder plan
    scenarios/page.tsx    Scenario library
    methodology/page.tsx  Compliance and rules methodology
  components/
    ApprovalReadinessMeter.tsx
    BuilderPlan.tsx
    CalculatorHub.tsx
    CreditDashboard.tsx
    DecisionSimulator.tsx
    EducationUnlockCard.tsx
    FactorBreakdown.tsx
    LendingLab.tsx
    LoanOfferCard.tsx
    LoanTimeline.tsx
    RiskBadge.tsx
    ScenarioCard.tsx
    UtilizationChart.tsx
  lib/
    creditEngine.ts       Deterministic credit rules engine
    lendingEngine.ts      Synthetic loan math and readiness engine
    demoData.ts           Synthetic Maya profile, scenarios, and offers
    format.ts             Formatting helpers
tests/
  creditEngine.test.ts
  lendingEngine.test.ts
```

The app keeps business logic separate from the UI. `src/lib/creditEngine.ts` owns the typed credit rules, factor breakdown, recommendations, and 30-day plan generation. `src/lib/lendingEngine.ts` owns EMI math, synthetic loan comparisons, approval-readiness, timelines, and education unlocks. UI components consume engine output and do not invent risk results.

## Rules Engine Methodology

CreditCrest AI models common credit education factors:

- Payment history
- Utilization / amounts owed
- Length of credit history
- New credit / inquiries
- Credit mix

Core credit rules:

- Utilization under 10% = excellent
- 10-29% = good
- 30-49% = caution
- 50-74% = high
- 75%+ = critical
- Any missed payment = critical payment history warning
- New credit application = medium risk unless profile already has recent inquiries, then high risk
- Paying down balance improves utilization
- Credit limit increase without hard inquiry can help utilization
- Financing a new purchase may add inquiry and new-account risk
- Minimum-only payment warns about balance persistence and utilization remaining high

Lending Lab rules:

- EMI is calculated from synthetic principal, APR, and term
- Total repayment equals monthly payment times term
- Total interest equals total repayment minus principal
- Payment burden compares EMI with synthetic monthly income
- Payment burden above 5% adds caution
- Payment burden above 10% is high risk
- Utilization above 50% reduces approval-readiness
- Utilization above 75% strongly reduces approval-readiness
- Recent inquiries and missed payment history add caution
- Secured builder paths can improve readiness, but are still simulated and not guaranteed
- 0% split plans with no inquiry are lower cost, but still require payment discipline

Calculator Hub rules:

- EMI subtracts down payment from principal before calculating payment
- Utilization paydown calculates the amount needed to hit 30%, 10%, or a custom target
- APR comparison shows monthly payment, total repayment, total interest, and differences between synthetic options
- Payment burden compares modeled payment with synthetic monthly income
- Credit limit impact assumes the balance stays fixed and explains that lender behavior may involve inquiry risk

The app intentionally avoids exact score-point estimates. Results are directional: Helps, Neutral, Slight risk, Significant risk, or simulated approval-readiness labels.

## Privacy and Compliance Notes

- Educational prototype, not financial advice
- Does not calculate official credit scores
- Uses synthetic demo data only
- Uses synthetic lending offers only
- Approval-readiness is not approval or denial
- No real loan applications
- No real lender offers
- No lender matching
- Calculator Hub inputs are educational and should not use sensitive real data
- No SSNs
- No real bank credentials
- No real credit bureau data
- No real income verification
- No external paid APIs
- Checklist progress is stored only in browser localStorage

## Future Roadmap

- Credit bureau API integration
- Open banking integration
- Rent reporting partnerships
- Secured card marketplace
- AI financial coach
- Merchant checkout plugin
- Multilingual financial literacy

## Known Prototype Boundaries

- Single synthetic profile
- Deterministic model only, with no real underwriting or bureau data
- No authentication
- No production persistence beyond localStorage
- Educational factor model, not a credit score model
- Lending Lab offers are synthetic examples, not real lending products

## License

MIT

## Screenshots ##

<img width="2820" height="3548" alt="Screenshot_30-5-2026_173339_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/58ea6e23-1a4b-465b-9c84-0e644f904871" />

<img width="2820" height="3158" alt="Screenshot_30-5-2026_173358_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/a9858463-9eba-48dc-bb8b-29319779b98e" />

<img width="2820" height="4845" alt="Screenshot_30-5-2026_173419_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/358ce65b-c4a5-4a45-a3d9-a4e3e1dafe11" />

<img width="2820" height="3715" alt="Screenshot_30-5-2026_173436_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/88b1676e-4cc8-4ee5-97d5-4a5830095ac0" />

<img width="2820" height="3019" alt="Screenshot_30-5-2026_173447_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/d6f9a08a-7a47-451b-aa0d-3943bb37ca05" />

<img width="2820" height="1968" alt="Screenshot_30-5-2026_17351_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/144eeb35-a2cc-4037-8305-141087d6ef8f" />

<img width="2820" height="4957" alt="Screenshot_30-5-2026_173511_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/77ea6e80-1624-4b8e-9bcf-a9ac237a7f2f" />
