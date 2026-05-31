# CreditCrest AI

## Live Demo

[Launch CreditCrest AI](https://creditcrest-ai.vercel.app/)

**Know the credit impact before you make the move.**

CreditCrest AI is a production-oriented educational prototype: a consumer credit simulator that helps early credit builders understand how purchases, payments, applications, financing, utilization changes, missed payments, and synthetic borrowing paths may affect their credit-building behavior.

It does **not** calculate an official credit score and does **not** provide financial advice. It uses synthetic demo data, optional browser-only Financial Snapshots, and deterministic educational rules.

## Problem

Most credit apps explain what already happened after a statement closes, an inquiry appears, or a missed payment is reported. Students and early credit builders often need guidance before they make a decision.

## Solution

CreditCrest AI gives users a fast simulator that models the likely directional credit impact of a decision before they act. The default learning path focuses on Maya, a synthetic 22-year-old student profile with 49% utilization, one recent inquiry, a young credit file, one late payment from 10 months ago, and synthetic monthly income of $2,400 for lending simulations. Users can optionally create a local Financial Snapshot with rounded, non-sensitive inputs to personalize the educational defaults.

## Features

- Mobile-first dashboard for the Maya synthetic profile
- Optional Financial Snapshot onboarding stored only in browser localStorage
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
- Unit tests for the credit, lending, calculator, and snapshot logic

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

## Public Pages

- [Privacy](https://creditcrest-ai.vercel.app/privacy)
- [Disclaimer](https://creditcrest-ai.vercel.app/disclaimer)

## Production Readiness Docs

- [Privacy Policy Draft](docs/PRIVACY_POLICY_DRAFT.md)
- [Disclaimer](docs/DISCLAIMER.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Accessibility QA](docs/ACCESSIBILITY_QA.md)
- [Mobile QA](docs/MOBILE_QA.md)
- [Security Review](docs/SECURITY_REVIEW.md)

## Production Readiness Docs

- [Privacy Policy Draft](docs/PRIVACY_POLICY_DRAFT.md)
- [Disclaimer](docs/DISCLAIMER.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Accessibility QA](docs/ACCESSIBILITY_QA.md)
- [Mobile QA](docs/MOBILE_QA.md)
- [Security Review](docs/SECURITY_REVIEW.md)

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
5. Optional: open Financial Snapshot and show that personalization is stored only in this browser.
6. Open Lending Lab.
7. Compare Crest Starter vs Crest Builder Secured vs Crest FastCash.
8. Show EMI/monthly payment, total repayment, approval-readiness, and borrower timeline.
9. Emphasize: "CreditCrest AI turns borrowing into a transparent educational simulation before the user signs."

## Architecture Overview

```text
src/
  app/
    page.tsx              Dashboard
    onboarding/page.tsx   Local Financial Snapshot onboarding
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
    FinancialSnapshotOnboarding.tsx
    LendingLab.tsx
    LoanOfferCard.tsx
    LoanTimeline.tsx
    RiskBadge.tsx
    ScenarioCard.tsx
    UtilizationChart.tsx
  lib/
    creditEngine.ts       Deterministic credit rules engine
    lendingEngine.ts      Synthetic loan math and readiness engine
    financialSnapshot.ts  Local snapshot parsing, storage, and conversion
    useFinancialSnapshot.ts
    demoData.ts           Synthetic Maya profile, scenarios, and offers
    format.ts             Formatting helpers
tests/
  creditEngine.test.ts
  financialSnapshot.test.ts
  lendingEngine.test.ts
```

The app keeps business logic separate from the UI. `src/lib/creditEngine.ts` owns the typed credit rules, factor breakdown, recommendations, and 30-day plan generation. `src/lib/lendingEngine.ts` owns EMI math, synthetic loan comparisons, approval-readiness, timelines, and education unlocks. `src/lib/financialSnapshot.ts` owns local snapshot validation, storage helpers, and conversion into the existing profile types. UI components consume engine output and do not invent risk results.

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

Financial Snapshot rules:

- Snapshot onboarding is optional; the Maya synthetic profile remains the fallback
- Snapshot data is stored only in browser localStorage
- Inputs are limited to nickname, rounded monthly income estimate, monthly debt obligations, card balance, card limit, recent inquiries, missed-payment range, oldest account age, and primary goal
- Snapshot values convert into the same typed profile shapes used by the deterministic engines
- Invalid or missing snapshots are ignored and the Maya demo profile is used

The app intentionally avoids exact score-point estimates. Results are directional: Helps, Neutral, Slight risk, Significant risk, or simulated approval-readiness labels.

## Privacy and Compliance Notes

- Educational prototype, not financial advice
- Does not calculate official credit scores
- Uses synthetic demo data only
- Optional Financial Snapshot data is stored only in the user's browser
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
- No full dates of birth
- No account numbers
- No document uploads
- No lender application data
- No external paid APIs
- Checklist progress and optional snapshots are stored only in browser localStorage

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
- Optional local snapshot personalization, with no backend sync
- Deterministic model only, with no real underwriting or bureau data
- No authentication
- No production persistence beyond localStorage
- Educational factor model, not a credit score model
- Lending Lab offers are synthetic examples, not real lending products

## License

MIT

## Screenshots ##

<img width="2820" height="3158" alt="Screenshot_31-5-2026_9307_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/89185e81-9b79-4e6e-95a4-e9d4aba6f5c6" />

<img width="2820" height="4845" alt="Screenshot_31-5-2026_93019_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/741f378a-3985-4ec7-a260-de548313c31b" />

<img width="2820" height="3715" alt="Screenshot_31-5-2026_93033_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/479943fc-1e99-4833-abee-29bb1d6f50dd" />

<img width="2820" height="2325" alt="Screenshot_31-5-2026_93050_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/67a972cc-b8f1-4f1f-904b-fd38064bde29" />

<img width="2820" height="3019" alt="Screenshot_31-5-2026_9311_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/08f98785-7513-41f7-8706-e6eec50fc2ea" />

<img width="2820" height="1968" alt="Screenshot_31-5-2026_93121_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/b932bf3b-4bf2-4586-9e0e-9057c5ebe895" />

<img width="2820" height="5971" alt="Screenshot_31-5-2026_93132_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/16624f59-e43c-46c3-a163-af7dfe759834" />

<img width="2820" height="3593" alt="Screenshot_31-5-2026_92939_creditcrest-ai vercel app" src="https://github.com/user-attachments/assets/b72558ae-185f-4d6e-b191-5337b6c942fd" />
