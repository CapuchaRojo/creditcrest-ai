# CreditCrest AI

## Live Demo

[Launch CreditCrest AI](https://creditcrest-ai.vercel.app/)

**Know the credit impact before you make the move.**

CreditCrest AI is a hackathon MVP for CodeCrest: a real-time credit decision coach that helps early credit builders understand how purchases, payments, applications, financing, utilization changes, and missed payments may affect their credit-building path.

It does **not** calculate an official credit score and does **not** provide financial advice. It uses synthetic demo data and deterministic educational rules.

## Problem

Most credit apps explain what already happened after a statement closes, an inquiry appears, or a missed payment is reported. Students and early credit builders often need guidance before they make a decision.

## Solution

CreditCrest AI gives users a fast simulator that models the likely directional credit impact of a decision before they act. The MVP focuses on Maya, a synthetic 22-year-old student profile with 49% utilization, one recent inquiry, a young credit file, and one late payment from 10 months ago.

## Features

- Mobile-first dashboard for the Maya synthetic profile
- Health summary across payment history, utilization, new credit, credit age, and credit mix
- Recharts utilization visualization
- Decision simulator with live inputs and deterministic recommendations
- Scenario library with one-click demo scenarios
- 30-day credit builder plan with local checklist progress
- About / compliance / methodology page
- Clear educational disclaimers and no sensitive-data collection
- Unit tests for the credit rules engine

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React icons
- Vitest
- Local deterministic rules engine
- Synthetic data and browser localStorage only

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
```

## Demo Script for Devpost

1. Open dashboard for Maya.
2. Show she has 49% utilization.
3. Click “Buy a $600 laptop today.”
4. App shows utilization jumps near 89% and flags high/critical risk.
5. App recommends paying down balance first or splitting payment.
6. Click “Pay $300 toward balance.”
7. App shows utilization improves and recommends safer next step.
8. Open 30-day plan.
9. Close with: “CreditCrest AI helps users understand credit consequences before they act.”

## Architecture Overview

```text
src/
  app/
    page.tsx              Dashboard
    simulator/page.tsx    Interactive decision simulator
    plan/page.tsx         30-day builder plan
    scenarios/page.tsx    Scenario library
    methodology/page.tsx  Compliance and rules methodology
  components/
    BuilderPlan.tsx
    CreditDashboard.tsx
    DecisionSimulator.tsx
    FactorBreakdown.tsx
    RiskBadge.tsx
    ScenarioCard.tsx
    UtilizationChart.tsx
  lib/
    creditEngine.ts       Deterministic rules engine
    demoData.ts           Synthetic Maya profile and scenarios
    format.ts             Formatting helpers
tests/
  creditEngine.test.ts
```

The app keeps business logic separate from the UI. `src/lib/creditEngine.ts` owns the typed rules, factor breakdown, recommendations, and 30-day plan generation. UI components consume the engine output and do not invent risk results.

## Rules Engine Methodology

CreditCrest AI models common credit education factors:

- Payment history
- Utilization / amounts owed
- Length of credit history
- New credit / inquiries
- Credit mix

Core rules:

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

The app intentionally avoids exact score-point estimates. Results are directional: Helps, Neutral, Slight risk, or Significant risk.

## Privacy and Compliance Notes

- Educational MVP, not financial advice
- Does not calculate official credit scores
- Uses synthetic demo data only
- No SSNs
- No real bank credentials
- No real credit bureau data
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

## Known MVP Boundaries

- Single synthetic profile
- Deterministic model only, with no real underwriting or bureau data
- No authentication
- No production persistence beyond localStorage
- Educational factor model, not a credit score model

## License

MIT
