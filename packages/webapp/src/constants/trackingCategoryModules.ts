export const TrackingCategoryModules = {
  SaleInvoices: 'sale_invoices',
  SaleEstimates: 'sale_estimates',
  ManualJournals: 'manual_journals',
} as const;

export type TrackingCategoryModule =
  (typeof TrackingCategoryModules)[keyof typeof TrackingCategoryModules];

export const TRACKING_CATEGORY_MODULES: TrackingCategoryModule[] = [
  TrackingCategoryModules.SaleInvoices,
  TrackingCategoryModules.SaleEstimates,
  TrackingCategoryModules.ManualJournals,
];

export const TRACKING_CATEGORY_MODULE_LABELS: Record<
  TrackingCategoryModule,
  string
> = {
  [TrackingCategoryModules.SaleInvoices]:
    'tracking_categories.module.sale_invoices',
  [TrackingCategoryModules.SaleEstimates]:
    'tracking_categories.module.sale_estimates',
  [TrackingCategoryModules.ManualJournals]:
    'tracking_categories.module.manual_journals',
};
