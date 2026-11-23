const PLANS = [
  {
    slug: 'capital-basic',
    monthlySlug: 'capital-basic-monthly',
    annuallySlug: 'capital-basic-annually',
    name: 'Capital Basic',
    description: 'Good for service businesses that just started.',
    featured: false,
    index: 1,
    features: [
      { text: 'Unlimited Sale Invoices' },
      { text: 'Unlimited Sale Estimates' },
      { text: 'Track GST and VAT' },
      { text: 'Connect Banks for Automatic Importing' },
      { text: 'Chart of Accounts' },
      { text: 'Manual Journals' },
      { text: 'Basic Financial Reports & Insights' },
      { text: 'Unlimited User Seats' },
    ],
  },
  {
    slug: 'capital-essential',
    monthlySlug: 'capital-essential-monthly',
    annuallySlug: 'capital-essential-annually',
    name: 'Capital Essential',
    description: 'Good for businesses that have inventory and want more financial reports.',
    featured: false,
    index: 2,
    features: [
      { text: 'All Capital Basic features' },
      { text: 'Purchase Invoices' },
      { text: 'Multi Currency Transactions' },
      { text: 'Transactions Locking' },
      { text: 'Inventory Tracking' },
      { text: 'Smart Financial Reports' },
      { text: 'Advanced Inventory Reports' },
    ],
  },
  {
    slug: 'capital-plus',
    monthlySlug: 'capital-plus-monthly',
    annuallySlug: 'capital-plus-annually',
    name: 'Capital Plus',
    description: 'Good for businesses that want financial and access control.',
    featured: true,
    index: 3,
    features: [
      { text: 'All Capital Essential features' },
      { text: 'Custom User Roles Access' },
      { text: 'Vendor Credits' },
      { text: 'Budgeting' },
      { text: 'Analysis Cost Center' },
    ],
  },
  {
    slug: 'capital-big',
    monthlySlug: 'capital-big-monthly',
    annuallySlug: 'capital-big-annually',
    name: 'Capital Big',
    description: 'Good for businesses with multiple branches.',
    featured: false,
    index: 4,
    features: [
      { text: 'All Capital Plus features' },
      { text: 'Multiple Branches' },
      { text: 'Multiple Warehouses' },
    ],
  },
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  for (const plan of PLANS) {
    for (const slug of [plan.monthlySlug, plan.annuallySlug]) {
      const exists = await knex('subscription_plans').where('slug', slug).first();
      if (!exists) continue;

      await knex('subscription_plans').where('slug', slug).update({
        name: plan.name,
        desc: plan.description,
        family_slug: plan.slug,
        features: JSON.stringify(plan.features),
        is_featured: plan.featured,
        index: plan.index,
        active: true,
      });
    }
  }

  // Keep the self-hosted free plan clearly separated from Cloud plans.
  await knex('subscription_plans').where('slug', 'free').update({
    family_slug: 'free',
    is_featured: false,
    index: 0,
    active: true,
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('subscription_plans')
    .whereIn('family_slug', PLANS.map((plan) => plan.slug))
    .update({
      family_slug: null,
      features: null,
      is_featured: false,
    });
};
