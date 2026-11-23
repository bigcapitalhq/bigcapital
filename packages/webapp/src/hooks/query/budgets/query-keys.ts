// Query key constants
export const BUDGETS = 'BUDGETS';

// Query key factory
export const budgetsKeys = {
  all: () => [BUDGETS] as const,
  list: (query?: Record<string, unknown>) => [BUDGETS, 'list', query] as const,
  detail: (id: number | string) => [BUDGETS, 'detail', id] as const,
};

// Grouped object for use in components/hooks
export const BudgetsQueryKeys = {
  BUDGETS,
} as const;
