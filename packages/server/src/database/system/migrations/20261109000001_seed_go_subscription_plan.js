const GO_PLAN_FEATURES = [
  { text: 'Unlimited Sale Invoices' },
  { text: 'Unlimited Bills' },
  { text: 'Unlimited Sale Estimates' },
  { text: 'Track GST and VAT' },
  { text: 'Connect Banks for Automatic Importing' },
  { text: 'Chart of Accounts' },
  { text: 'Manual Journals' },
  { text: 'Basic Financial Reports & Insights' },
  { text: 'Unlimited User Seats' },
  { text: 'Purchase Invoices' },
  { text: 'Multi Currency Transactions' },
  { text: 'Transactions Locking' },
  { text: 'Inventory Tracking' },
  { text: 'Smart Financial Reports' },
  { text: 'Advanced Inventory Reports' },
  { text: 'Custom User Roles Access' },
  { text: 'Vendor Credits' },
  { text: 'Budgeting' },
  { text: 'Analysis Cost Center' },
  { text: 'Multiple Branches' },
  { text: 'Multiple Warehouses' },
];

const GO_PLAN_PRICES = [
  {
    slug: 'go-monthly',
    price: 10,
    invoiceInterval: 'month',
    invoicePeriod: 1,
  },
  {
    slug: 'go-annually',
    price: 90,
    invoiceInterval: 'year',
    invoicePeriod: 1,
  },
];

/**
 * Replaces the legacy Cloud plan catalog with the single Go plan.
 *
 * Legacy plans are deactivated instead of deleted so existing subscriptions
 * keep their plan relation and can be grandfathered.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex('subscription_plans')
    .whereNotIn('slug', ['free', 'go-monthly', 'go-annually'])
    .update({ active: false });

  for (const price of GO_PLAN_PRICES) {
    const plan = {
      name: 'Go',
      slug: price.slug,
      desc: 'Everything you need to run your business.',
      price: price.price,
      active: true,
      currency: 'USD',
      invoice_period: price.invoicePeriod,
      invoice_interval: price.invoiceInterval,
      family_slug: 'go',
      features: JSON.stringify(GO_PLAN_FEATURES),
      is_featured: true,
      index: 1,
    };

    const exists = await knex('subscription_plans')
      .where('slug', price.slug)
      .first();

    if (exists) {
      await knex('subscription_plans').where('slug', price.slug).update(plan);
    } else {
      await knex('subscription_plans').insert(plan);
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('subscription_plans')
    .whereIn(
      'slug',
      GO_PLAN_PRICES.map((price) => price.slug),
    )
    .update({ active: false });

  await knex('subscription_plans')
    .whereIn('slug', [
      'capital-basic-monthly',
      'capital-basic-annually',
      'capital-essential-monthly',
      'capital-essential-annually',
      'capital-plus-monthly',
      'capital-plus-annually',
      'capital-big-monthly',
      'capital-big-annually',
    ])
    .update({ active: true });
};
