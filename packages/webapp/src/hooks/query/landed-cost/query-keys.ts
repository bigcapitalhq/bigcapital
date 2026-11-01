// Query key constants
export const LANDED_COST = 'LANDED_COST';
export const LANDED_COST_TRANSACTION = 'LANDED_COST_TRANSACTION';

// Query key factory
export const landedCostKeys = {
  all: () => [LANDED_COST] as const,
  list: (query?: Record<string, unknown>) => [LANDED_COST, query] as const,
  transactions: () => [LANDED_COST_TRANSACTION] as const,
  transaction: (id?: number | null) => [LANDED_COST_TRANSACTION, id] as const,
};

// Grouped object for use in components/hooks
export const LandedCostQueryKeys = {
  LANDED_COST,
  LANDED_COST_TRANSACTION,
} as const;
