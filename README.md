# PayBills.rent — Finderr conversion

Mobile-first swipe-to-sponsor prototype based on the supplied Finderr React/Vite/Express repository.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npm run build` before deployment.

## Current implementation

- Swipe through clearly labeled sample bills; sample bills **cannot be funded**.
- Submit bill metadata for review. Submissions remain private and pending review.
- Stripe Checkout endpoint exists but **will not initiate checkout** unless the bill is independently verified, Stripe is configured, and `PAYMENTUS_APPROVED=true` is explicitly set after actual approval.
- Stripe webhook signature validation is implemented. It **does not disburse funds**.
- Paymentus integration is intentionally not live: no partner API contract, authorized endpoints, or approved settlement details were supplied.

## Required before production

1. Obtain written Stripe and Paymentus approval for sponsored third-party bill payments, including funds flow and refunds.
2. Implement verified biller onboarding, applicant authorization, live bill inquiry, duplicate prevention, exact bill/account matching, and privacy-safe document storage.
3. Replace local JSON storage and in-memory webhook tracking with transactional database records, idempotent webhook processing, reconciliation, and authenticated admin review.
4. Add secure applicant and sponsor authentication, anti-abuse checks, consent, audit logs, refund rules, and regulatory/legal review.
5. Integrate documented Paymentus endpoints behind a server-only adapter. Do not infer SDK or API methods from examples.
6. Implement settlement confirmation and biller-credit verification before showing `PAID`.
7. Confirm funding eligibility and payout routing; never send applicant cash or allow applicant-controlled payout destinations.

**Do not set `PAYMENTUS_APPROVED=true` solely to test checkout with real money.**
