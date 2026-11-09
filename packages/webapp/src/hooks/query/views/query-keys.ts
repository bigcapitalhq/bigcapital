// Query key constants for views
export const RESOURCE_VIEW = 'RESOURCE_VIEW';
export const RESOURCE_META = 'RESOURCE_META';

// Query key factory
export const viewsKeys = {
  all: () => [RESOURCE_VIEW] as const,
  view: (resourceSlug: string | null | undefined) =>
    [RESOURCE_VIEW, resourceSlug] as const,
  meta: (resourceSlug: string | null | undefined) =>
    [RESOURCE_META, resourceSlug] as const,
};

// Grouped object for use in components/hooks
export const ViewsQueryKeys = {
  RESOURCE_VIEW,
  RESOURCE_META,
} as const;
