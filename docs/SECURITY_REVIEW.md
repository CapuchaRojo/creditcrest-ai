# Security Review

## Sensitive Data Inventory

Current builds should not collect SSNs, full dates of birth, bank credentials, credit bureau credentials, account numbers, real identity documents, uploaded files, or real loan applications.

Before release, verify all forms, local storage keys, logs, tests, screenshots, and docs against that inventory.

## Storage Review

- [ ] Browser localStorage values reviewed
- [ ] AsyncStorage values reviewed where applicable
- [ ] No secrets stored client-side
- [ ] Reset/delete local demo data paths verified
- [ ] No real documents or uploads stored

## Dependency Review

- [ ] `npm audit` reviewed
- [ ] Package lockfile changes reviewed
- [ ] New packages justified
- [ ] Native packages reviewed for platform permissions
- [ ] No unused high-risk packages included

## Future Integration Risks

Review security and compliance before adding:

- Identity verification
- Secure document upload
- Open banking
- Credit bureau soft pulls
- Licensed lender partner APIs
- Payment processors
- Analytics or event tracking
- Backend account systems

## Production Activation Blockers

Do not activate real lending or sensitive-data workflows until the following are complete:

- Legal and compliance review
- Privacy policy finalized
- Data retention and deletion model
- Vendor due diligence
- Encryption and secrets management
- Audit logging and monitoring
- Incident response process
- App store policy review
- Partner contracts and licensing analysis
