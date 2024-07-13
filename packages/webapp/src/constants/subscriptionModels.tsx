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
      { text: 'Manual Journals' },
      { text: 'Basic Financial Reports & Insights' },
      { text: 'Unlimited User Seats' },
    ],
    monthlyPrice: '$10',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$7.5',
    annuallyPriceLabel: 'Per month',
    monthlyVariantId: '446152',
    annuallyVariantId: '446153',
  },
  {
    name: 'Capital Essential',
    slug: 'capital_plus',
    description: 'Good for have inventory and want more financial reports.',
    features: [
      { text: 'All Capital Basic features' },
      { text: 'Purchase Invoices' },
      { text: 'Multi Currency Transactions' },
      { text: 'Transactions Locking' },
      { text: 'Inventory Tracking' },
      { text: 'Smart Financial Reports' },
      { text: 'Advanced Inventory Reports' },
    ],
    monthlyPrice: '$20',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$15',
    annuallyPriceLabel: 'Per month',
    monthlyVariantId: '446165',
    annuallyVariantId: '446164',
  },
  {
    name: 'Capital Plus',
    slug: 'essentials',
    description: 'Good for business want financial and access control.',
    features: [
      { text: 'All Capital Essential features' },
      { text: 'Custom User Roles Access' },
      { text: 'Vendor Credits' },
      { text: 'Budgeting' },
      { text: 'Analysis Tracking Tags' },
    ],
    monthlyPrice: '$25',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$18',
    annuallyPriceLabel: 'Per month',
    featured: true,
    monthlyVariantId: '446165',
    annuallyVariantId: '446164',
  },
  {
    name: 'Capital Big',
    slug: 'essentials',
    description: 'Good for businesses have multiple branches.',
    features: [
      { text: 'All Capital Plus features' },
      { text: 'Multiple Branches' },
      { text: 'Multiple Warehouses' },
    ],
    monthlyPrice: '$40',
    monthlyPriceLabel: 'Per month',
    annuallyPrice: '$30',
    annuallyPriceLabel: 'Per month',
    monthlyVariantId: '446167',
    annuallyVariantId: '446168',
  },
] as SubscriptionPlan[];
