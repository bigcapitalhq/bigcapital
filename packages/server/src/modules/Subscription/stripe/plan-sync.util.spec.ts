import { ensureStripeProductAndPrice } from './plan-sync.util';

const buildStripe = () => ({
  products: {
    create: jest.fn(),
  },
  prices: {
    retrieve: jest.fn(),
    list: jest.fn(),
    create: jest.fn(),
  },
});

const buildPlan = (overrides: Record<string, unknown> = {}) => ({
  slug: 'capital-basic-monthly',
  name: 'Capital Basic',
  desc: 'Good for service businesses that just started.',
  familySlug: 'capital-basic',
  price: 10,
  currency: 'USD',
  invoiceInterval: 'month',
  invoicePeriod: 1,
  ...overrides,
});

describe('ensureStripeProductAndPrice', () => {
  it('creates a product and a price when the plan has no Stripe ids', async () => {
    const stripe = buildStripe();
    stripe.products.create.mockResolvedValue({ id: 'prod_123' });
    stripe.prices.list.mockResolvedValue({ data: [] });
    stripe.prices.create.mockResolvedValue({ id: 'price_123' });

    const result = await ensureStripeProductAndPrice(
      stripe as never,
      buildPlan() as never,
    );

    expect(stripe.products.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Capital Basic' }),
      { idempotencyKey: 'bigcapital-product-capital-basic' },
    );
    expect(stripe.prices.create).toHaveBeenCalledWith(
      expect.objectContaining({
        product: 'prod_123',
        unit_amount: 1000,
        currency: 'usd',
        lookup_key: 'bigcapital_capital-basic-monthly_1000',
      }),
      { idempotencyKey: 'bigcapital-price-capital-basic-monthly-1000' },
    );
    expect(result).toEqual({ productId: 'prod_123', priceId: 'price_123' });
  });

  it('reuses an existing matching price', async () => {
    const stripe = buildStripe();
    stripe.prices.retrieve.mockResolvedValue({
      id: 'price_existing',
      active: true,
      unit_amount: 1000,
      currency: 'usd',
      recurring: { interval: 'month', interval_count: 1 },
    });

    const result = await ensureStripeProductAndPrice(
      stripe as never,
      buildPlan({
        stripeProductId: 'prod_123',
        stripePriceId: 'price_existing',
      }) as never,
    );

    expect(stripe.products.create).not.toHaveBeenCalled();
    expect(stripe.prices.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      productId: 'prod_123',
      priceId: 'price_existing',
    });
  });
});
