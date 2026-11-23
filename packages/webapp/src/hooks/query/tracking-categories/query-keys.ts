export const TRACKING_CATEGORIES = 'TRACKING_CATEGORIES';
export const TRACKING_CATEGORY = 'TRACKING_CATEGORY';

export const trackingCategoriesKeys = {
  all: () => [TRACKING_CATEGORIES] as const,
  list: () => [TRACKING_CATEGORIES] as const,
  detail: (id: number | string | null | undefined) =>
    [TRACKING_CATEGORY, id] as const,
};

export const TrackingCategoriesQueryKeys = {
  TRACKING_CATEGORIES,
  TRACKING_CATEGORY,
} as const;
