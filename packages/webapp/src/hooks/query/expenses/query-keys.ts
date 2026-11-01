// Query key constants
export const EXPENSES = 'EXPENSES';
export const EXPENSE = 'EXPENSE';

// Query key factory
export const expensesKeys = {
  all: () => [EXPENSES] as const,
  list: (query?: Record<string, unknown>) => [EXPENSES, query] as const,
  detail: (id: number | null | undefined) => [EXPENSE, id] as const,
};

// Grouped object for use in components/hooks
export const ExpensesQueryKeys = {
  EXPENSES,
  EXPENSE,
} as const;
