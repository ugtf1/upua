# Store checkout sandbox

This is a local development prototype, not a production payment flow. Production checkout and the former unconfirmed PaymentIntent endpoint return unavailable, even if live credentials are present. No refunds, payouts, QuickBooks writes, fulfillment, or actual customer notifications are implemented. A returned browser URL is not proof of payment.

For local tests only, use a dedicated non-production PostgreSQL database. Review and apply the migrations to that database only. Configure `DATABASE_URL` privately, set `STRIPE_SANDBOX_CHECKOUT=1`, `STRIPE_SANDBOX_ORIGIN=http://localhost:3000`, `UPUA_STORE_STRIPE_TEST_KEY` (`sk_test_...` or `rk_test_...`), and `UPUA_STORE_STRIPE_TEST_WEBHOOK_SECRET` (`whsec_...`) in an untracked local environment file. Use only UPUA's separate test account, never live credentials. Checkout fails closed without all of these settings, and refuses to run outside Next.js development mode or with a non-local return origin.

The sandbox uses the source-controlled seed catalog, not the mutable production catalog. Prices, choices, quantities, and flat shipping are calculated on the server. Event registrations and custom-amount payments are intentionally unavailable. No attendee, customer, delivery or shipping details are preserved. A verified test-mode webhook can update the order status, but no order lookup, inventory or fulfillment workflow is implemented.

Webhook handling compares the signed raw body and timestamp, checks the test session ID, order reference, currency and amount, and uses conditional transitions so paid status takes precedence over failure or expiration. Sandbox webhook delivery and database migrations still require end-to-end testing against an isolated test environment. Interrupted requests can leave pending orders that require investigation. The temporary table must not be mistaken for a production order system.

Before any production checkout is considered: protect catalog mutation and payment APIs with real authorization; use the organization's reviewed catalog, variant and shipping/tax rules; add resilient order creation and recovery, private order tracking, delivery/attendee and fulfillment workflows, verified idempotent webhook handling tested with Stripe, restricted-key permissions verified with Stripe, and UPUA-controlled production approvals and secrets.

Run the unit tests with Node.js 22.18 or later:

```sh
node --test tests/stripe-*.test.mjs
```
