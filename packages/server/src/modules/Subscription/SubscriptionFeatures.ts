/**
 * Plan-level features that can be required on controllers and endpoints.
 *
 * The names are intentionally stable identifiers and should not be used for
 * display. Human-readable labels live in each plan's `features` column.
 */
export enum SubscriptionFeature {
  SaleInvoices = 'sale_invoices',
  Bills = 'bills',
  SaleEstimates = 'sale_estimates',
  BankFeeds = 'bank_feeds',
  Accounts = 'accounts',
  ManualJournals = 'manual_journals',
  FinancialReports = 'financial_reports',
  UserSeats = 'user_seats',
  MultiCurrency = 'multi_currency',
  TransactionsLocking = 'transactions_locking',
  Inventory = 'inventory',
  UserRoles = 'user_roles',
  VendorCredits = 'vendor_credits',
  Budgeting = 'budgeting',
  CostCenters = 'cost_centers',
  Branches = 'branches',
  Warehouses = 'warehouses',
  SalesTax = 'sales_tax',
  SmsNotifications = 'sms_notifications',
  LandedCost = 'landed_cost',
  TrackingCategories = 'tracking_categories',
  BatchTracking = 'batch_tracking',
}

export const ALL_SUBSCRIPTION_FEATURES: SubscriptionFeature[] =
  Object.values(SubscriptionFeature);

const BASIC_PLAN_FEATURES: SubscriptionFeature[] = [
  SubscriptionFeature.SaleInvoices,
  SubscriptionFeature.SaleEstimates,
  SubscriptionFeature.SalesTax,
  SubscriptionFeature.BankFeeds,
  SubscriptionFeature.Accounts,
  SubscriptionFeature.ManualJournals,
  SubscriptionFeature.FinancialReports,
  SubscriptionFeature.UserSeats,
];

const ESSENTIAL_PLAN_FEATURES: SubscriptionFeature[] = [
  ...BASIC_PLAN_FEATURES,
  SubscriptionFeature.Bills,
  SubscriptionFeature.MultiCurrency,
  SubscriptionFeature.TransactionsLocking,
  SubscriptionFeature.Inventory,
];

const PLUS_PLAN_FEATURES: SubscriptionFeature[] = [
  ...ESSENTIAL_PLAN_FEATURES,
  SubscriptionFeature.UserRoles,
  SubscriptionFeature.VendorCredits,
  SubscriptionFeature.Budgeting,
  SubscriptionFeature.CostCenters,
];

const BIG_PLAN_FEATURES: SubscriptionFeature[] = [
  ...PLUS_PLAN_FEATURES,
  SubscriptionFeature.Branches,
  SubscriptionFeature.Warehouses,
];

/**
 * Features included in the legacy plan families.
 *
 * The Go plan is handled separately (it includes every feature), and unknown
 * or grandfathered plan families are not restricted.
 */
const PLAN_FAMILY_FEATURES: Record<string, SubscriptionFeature[]> = {
  'capital-basic': BASIC_PLAN_FEATURES,
  'capital-essential': ESSENTIAL_PLAN_FEATURES,
  'capital-plus': PLUS_PLAN_FEATURES,
  'capital-big': BIG_PLAN_FEATURES,
};

/**
 * Whether the given plan family is the Go plan.
 */
export const isGoPlanFamily = (familySlug?: string | null): boolean =>
  familySlug === 'go';

/**
 * Whether the given legacy plan family includes the feature.
 *
 * Returns `false` for the Go family so callers can decide whether the Go
 * bypass is enabled. Unknown or missing families are treated as unrestricted
 * to avoid locking out grandfathered subscriptions.
 */
export const planFamilyAllowsFeature = (
  familySlug: string | null | undefined,
  feature: string,
): boolean => {
  if (!familySlug || isGoPlanFamily(familySlug)) {
    return !familySlug;
  }
  const features = PLAN_FAMILY_FEATURES[familySlug];
  if (!features) {
    return true;
  }
  return features.includes(feature as SubscriptionFeature);
};
