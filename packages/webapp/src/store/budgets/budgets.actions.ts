import type { TableQuery } from '@/store/store.types';
import {
  BUDGETS_TABLE_STATE_RESET,
  BUDGETS_TABLE_STATE_SET,
} from '@/store/types';

export const setBudgetsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: BUDGETS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetBudgetsTableState = () => {
  return {
    type: BUDGETS_TABLE_STATE_RESET,
  };
};
