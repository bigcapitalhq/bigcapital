import type Stripe from 'stripe';

interface StripePlanLike {
  slug: string;
  name: string;
  desc?: string;
  familySlug?: string;
  price: number | string;
  currency?: string;
  invoiceInterval?: string;
  invoicePeriod?: number | string;
  stripeProductId?: string;
  stripePriceId?: string;
}

interface StripePlanArtifacts {
  productId: string;
  priceId: string;
}

const toCents = (price: number | string): number =>
  Math.round(Number(price) * 100);

/**
 * Ensures the given subscription plan has a matching Stripe product and price.
 * Prices are reused through deterministic lookup keys so repeated runs do not
 * create duplicates.
 */
export async function ensureStripeProductAndPrice(
  stripe: Stripe,
  plan: StripePlanLike,
): Promise<StripePlanArtifacts> {
  const amount = toCents(plan.price);
  const currency = (plan.currency || 'USD').toLowerCase();
  const interval = (plan.invoiceInterval || 'month') as
    | 'day'
    | 'week'
    | 'month'
    | 'year';
  const intervalCount = Number(plan.invoicePeriod) || 1;
  const familySlug = plan.familySlug || plan.slug;

  let productId = plan.stripeProductId;

  // Recover the product id when only the price id was persisted.
  if (!productId && plan.stripePriceId) {
    try {
      const existingPrice = await stripe.prices.retrieve(plan.stripePriceId);
      productId =
        typeof existingPrice.product === 'string'
          ? existingPrice.product
          : existingPrice.product.id;
    } catch {
      // The price was deleted in Stripe. Fall through and create a product.
    }
  }

  if (!productId) {
    const product = await stripe.products.create(
      {
        name: plan.name,
        description: plan.desc || undefined,
        metadata: {
          family_slug: familySlug,
          plan_slug: plan.slug,
        },
      },
      { idempotencyKey: `bigcapital-product-${familySlug}` },
    );
    productId = product.id;
  }

  // Reuse the existing price when it still matches the plan definition.
  if (plan.stripePriceId) {
    try {
      const existing = await stripe.prices.retrieve(plan.stripePriceId);
      if (
        existing.active &&
        existing.unit_amount === amount &&
        existing.currency === currency &&
        existing.recurring?.interval === interval &&
        (existing.recurring?.interval_count || 1) === intervalCount
      ) {
        return { productId, priceId: existing.id };
      }
    } catch {
      // The price was deleted in Stripe. Fall through and create a new one.
    }
  }

  const lookupKey = `bigcapital_${plan.slug}_${amount}`;
  const existingPrices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });

  let price = existingPrices.data[0];
  if (
    price &&
    (typeof price.product === 'string' ? price.product : price.product.id) !==
      productId
  ) {
    price = undefined;
  }
  if (!price) {
    price = await stripe.prices.create(
      {
        product: productId,
        unit_amount: amount,
        currency,
        recurring: { interval, interval_count: intervalCount },
        metadata: {
          family_slug: familySlug,
          plan_slug: plan.slug,
        },
        lookup_key: lookupKey,
      },
      { idempotencyKey: `bigcapital-price-${plan.slug}-${amount}` },
    );
  }

  return { productId, priceId: price.id };
}
