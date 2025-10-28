interface SubscriptionPlanFeature {
  text: string;
  hint?: string;
  label?: string;
  style?: Record<string, string>;
}
interface SubscriptionPlan {
  name: string;
  slug: string;
  description: string;
  features: SubscriptionPlanFeature[];
  featured?: boolean;
  monthlyPrice: string;
  monthlyPriceLabel: string;
  annuallyPrice: string;
  annuallyPriceLabel: string;
  monthlyVariantId: string;
  annuallyVariantId: string;
}

export const SubscriptionPlans = [
  {
    name: 'Capital Basic',
    slug: 'capital_basic',
    description: 'Good for service businesses that just started.',
    features: [
      {
        text: 'Unlimited Sale Invoices',
        hintLabel: 'Unlimited Sale Invoices',
        hint: 'Good for service businesses that just started for service businesses that just started',
      },
      { text: 'Unlimated Sale Estimates' },
      { text: 'Track GST and VAT' },
      { text: 'Connect Banks for Automatic Importing' },
      { text: 'Chart of Accounts' },
      {
        text: 'Manual Journals',
        hintLabel: 'Manual Journals',
        hint: 'Write manual journals entries for financial transactions not automatically captured by the system to adjust financial statements.',
      },
      {
        text: 'Basic Financial Reports & Insights',
        hint: 'Balance sheet, profit & loss statement, cashflow statement, general ledger, journal sheet, A/P aging summary, A/R aging summary',
      },
      { text: 'Unlimited User Seats' },
    ],
    monthlyPrice: '$20',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$15',
    annuallyPriceLabel: 'Per month',
    monthlyVariantId: '446152',
    // monthlyVariantId: '450016',
    annuallyVariantId: '446153',
    // annuallyVariantId: '450018',
  },
  {
    name: 'Capital Essential',
    slug: 'capital_plus',
    description: 'Good for have inventory and want more financial reports.',
    features: [
      { text: 'All Capital Basic features' },
      { text: 'Purchase Invoices' },
      {
        text: 'Multi Currency Transactions',
        hintLabel: 'Multi Currency',
        hint: 'Pay and get paid and do manual journals in any currency with real time exchange rates conversions.',
      },
      {
        text: 'Transactions Locking',
        hintLabel: 'Transactions Locking',
        hint: 'Transaction Locking freezes transactions to prevent any additions, modifications, or deletions of transactions recorded during the specified date.',
      },
      {
        text: 'Inventory Tracking',
        hintLabel: 'Inventory Tracking',
        hint: 'Track goods in the stock, cost of goods, and get notifications when quantity is low.',
      },
      { text: 'Smart Financial Reports' },
      { text: 'Advanced Inventory Reports' },
    ],
    monthlyPrice: '$40',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$30',
    annuallyPriceLabel: 'Per month',
    // monthlyVariantId: '450028',
    monthlyVariantId: '446155',
    // annuallyVariantId: '450029',
    annuallyVariantId: '446156',
  },
  {
    name: 'Capital Plus',
    slug: 'essentials',
    description: 'Good for business want financial and access control.',
    features: [
      { text: 'All Capital Essential features' },
      { text: 'Custom User Roles Access' },
      { text: 'Vendor Credits' },
      {
        text: 'Budgeting',
        hint: 'Create multiple budgets and compare targets with actuals to understand how your business is performing.',
      },
      { text: 'Analysis Cost Center' },
    ],
    monthlyPrice: '$55',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$40',
    annuallyPriceLabel: 'Per month',
    featured: true,
    // monthlyVariantId: '450031',
    monthlyVariantId: '446165',
    // annuallyVariantId: '450032',
    annuallyVariantId: '446164',
  },
  {
    name: 'Capital Big',
    slug: 'essentials',
    description: 'Good for businesses have multiple branches.',
    features: [
      { text: 'All Capital Plus features' },
      {
        text: 'Multiple Branches',
        hintLabel: '',
        hint: 'Track the organization transactions and accounts in multiple branches.',
      },
      {
        text: 'Multiple Warehouses',
        hintLabel: 'Multiple Warehouses',
        hint: 'Track the organization inventory in multiple warehouses and transfer goods between them.',
      },
    ],
    monthlyPrice: '$60',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$45',
    annuallyPriceLabel: 'Per month',
    // monthlyVariantId: '450024',
    monthlyVariantId: '446167',
    // annuallyVariantId: '450025',
    annuallyVariantId: '446168',
  },
] as SubscriptionPlan[];
