# CreditCrest AI Agent Notes

CreditCrest AI is a Next.js App Router hackathon MVP. Keep the product privacy-first, deterministic, and educational.

## Project Rules

- Do not add real credit bureau, banking, SSN, or credential collection flows.
- The rules engine in `src/lib/creditEngine.ts` is the source of truth for recommendations.
- Do not make official credit score or exact FICO point-change claims.
- Keep scenario recommendations directional: Helps, Neutral, Slight risk, Significant risk.
- Preserve the synthetic Maya profile unless the task explicitly asks for additional demo personas.

## Engineering Notes

- Run `npm run lint`, `npm run typecheck`, and `npm test` after logic or UI changes.
- Keep UI components modular under `src/components`.
- Prefer explicit TypeScript types for business logic and tests for new rules.
- If adding an AI explanation layer later, keep deterministic rules in control of the actual risk result.
