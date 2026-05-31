# Release Checklist

Use this checklist before a public release, demo submission, app store build, or production readiness milestone.

## Engineering

- [ ] `npm ci` completes successfully
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes where applicable
- [ ] Dependency audit reviewed
- [ ] No unrelated generated files included

## Product And Content

- [ ] README updated
- [ ] Screenshots updated
- [ ] Privacy policy draft reviewed
- [ ] Disclaimer reviewed
- [ ] Compliance copy reviewed
- [ ] Demo/sandbox labels remain visible
- [ ] Synthetic data boundaries remain clear

## QA

- [ ] Accessibility checked
- [ ] Mobile responsive behavior checked
- [ ] Main user journeys checked
- [ ] Empty states checked
- [ ] External links checked
- [ ] Local storage reset behavior checked where applicable

## Production Gate

- [ ] Sensitive data inventory reviewed
- [ ] Security review completed
- [ ] Future partner integrations remain disabled unless approved
- [ ] No real lending, lender matching, bank, bureau, or document workflows active without compliance approval
