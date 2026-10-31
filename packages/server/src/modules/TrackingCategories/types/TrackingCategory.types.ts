export enum TrackingCategoryModule {
  ManualJournals = 'manual_journals',
  SaleInvoices = 'sale_invoices',
  SaleEstimates = 'sale_estimates',
}

export const TRACKING_CATEGORY_MODULES = Object.values(TrackingCategoryModule);

export interface ITrackingCategoryAssignment {
  categoryId: number;
  optionId: number;
}

export interface ITrackingCategoryEntry {
  index?: number;
  trackingCategories?: ITrackingCategoryAssignment[];
}
