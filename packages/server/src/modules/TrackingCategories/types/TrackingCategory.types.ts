export interface ITrackingCategoryAssignment {
  categoryId: number;
  optionId: number;
}

export interface ITrackingCategoryEntry {
  index?: number;
  trackingCategories?: ITrackingCategoryAssignment[];
}
