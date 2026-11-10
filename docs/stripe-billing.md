# Stripe Billing (Bigcapital Cloud)

Bigcapital Cloud uses Stripe Billing for organization subscriptions. Self-hosted
installations remain free and never call Stripe.

## How it works

- A Cloud organization gets a Stripe Customer lazily when it starts checkout.
- Every new Cloud organization starts a full-access **15-day Go trial**. The
  trial length is configurable with `FREE_TRIAL_DAYS`.
- During the trial there are no document limits; all features are available.
- When the trial ends, the organization keeps read-only access. Write
  operations are blocked with `ORGANIZATION.SUBSCRIPTION.TRIAL_EXPIRED` until
  a paid subscription is active. Auth, onboarding, billing, and webhook routes
  are excluded.
- The initial subscription uses **Stripe Checkout** (hosted).
- Plan changes, cancellation, and resume are handled by the API.
- Payment methods, billing details, and invoices are available through the
  **Stripe Customer Portal**.
- Stripe webhooks are the source of truth and sync into the existing
  `subscription_plans` / `subscription_plan_subscriptions` system tables.

## Environment variables

```dotenv
HOSTED_ON_BIGCAPITAL_CLOUD=true

# Full-access trial length for new Cloud organizations, in days.
FREE_TRIAL_DAYS=15

# Falls back to STRIPE_PAYMENT_SECRET_KEY when empty.
STRIPE_BILLING_SECRET_KEY=sk_live_...

# From the Stripe webhook endpoint configuration.
STRIPE_BILLING_WEBHOOK_SECRET=whsec_...

# Optional Customer Portal configuration (bpc_...).
STRIPE_BILLING_PORTAL_CONFIGURATION_ID=

# Optional overrides. Default to ${BASE_URL}/preferences/billing
# STRIPE_BILLING_SUCCESS_URL=
# STRIPE_BILLING_CANCEL_URL=
```

## Database

Run the system migrations:

```bash
pnpm run build:server
pnpm run system:migrate:latest
```

The migrations add:

- `tenants.stripe_customer_id`
- Stripe product/price columns and plan metadata on `subscription_plans`
- Stripe subscription state on `subscription_plan_subscriptions`
- `stripe_webhook_events` for idempotent webhook handling
- A full-access trial for existing Cloud organizations that never started a
  paid subscription (based on `HOSTED_ON_BIGCAPITAL_CLOUD` / `FREE_TRIAL_DAYS`)

When running the migration container, make sure both
`HOSTED_ON_BIGCAPITAL_CLOUD` and `FREE_TRIAL_DAYS` are passed to it; the trial
backfill is skipped when the Cloud flag is missing.

## Provisioning plans in Stripe

Plan products and prices are created lazily before checkout. To provision the
whole catalog ahead of time:

```bash
pnpm run stripe:sync-plans
```

The command creates one Stripe product per plan family and one recurring price
per billing interval, then stores the ids in `subscription_plans`.

## Legacy Lemon Squeezy subscriptions

Existing Lemon Squeezy subscriptions are kept in the database and remain
active until they expire, but they are no longer manageable from the Billing
page. Migrate any remaining Lemon subscribers to Stripe manually before their
current period ends.

## Stripe webhook

Create a webhook endpoint pointing to:

```
https://your-domain/api/webhooks/stripe-billing
```

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Use the signing secret as `STRIPE_BILLING_WEBHOOK_SECRET`.

## Stripe Customer Portal

Configure the portal in the Stripe Dashboard:

- Enable payment method updates.
- Enable invoice history.
- Enable billing address / tax id updates if needed.
- Plan switching is optional; the Billing page also supports in-app plan changes.

If you use a non-default portal configuration, set
`STRIPE_BILLING_PORTAL_CONFIGURATION_ID`.

## Local development

Use Stripe test keys and forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe-billing
```

Set the printed `whsec_...` as `STRIPE_BILLING_WEBHOOK_SECRET`.

## API surface

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/subscription` | Current organization subscriptions |
| `GET` | `/api/subscription/plans` | Plan catalog |
| `POST` | `/api/subscription/stripe/checkout_session` | Create Stripe Checkout session |
| `POST` | `/api/subscription/stripe/portal_session` | Create Stripe Customer Portal session |
| `POST` | `/api/subscription/stripe/sync` | Sync a completed Checkout session |
| `POST` | `/api/subscription/change` | Change plan with proration |
| `POST` | `/api/subscription/cancel` | Cancel at period end |
| `POST` | `/api/subscription/resume` | Resume a scheduled cancellation |
| `POST` | `/api/webhooks/stripe-billing` | Stripe webhook receiver |
