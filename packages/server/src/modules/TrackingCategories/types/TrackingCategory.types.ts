export interface ITrackingCategoryAssignment {
  categoryId: number;
  optionId: number;
}

export interface ITrackingCategoryEntry {
  index?: number;
  debit?: number;
  credit?: number;
  trackingCategories?: ITrackingCategoryAssignment[];
}

export interface IMandatoryTrackingCategoryAssignment {
  index?: number;
  categoryId: number;
  categoryName: string;
}
