export interface CustomViewsState {
  views: Record<string, unknown>;
  resourceViews: Record<string, Array<unknown>>;
  viewsMeta: Record<string, unknown>;
}

export type CustomViewsAction = {
  type: string;
  view?: Record<string, unknown> & { id: string | number };
  views?: Array<Record<string, unknown> & { id: string | number }>;
  resource?: string;
};

export const VIEW_META_SET = 'VIEW_META_SET' as const;
export const VIEW_ITEMS_SET = 'VIEW_ITEMS_SET' as const;
export const RESOURCE_VIEWS_SET = 'RESOURCE_VIEWS_SET' as const;
