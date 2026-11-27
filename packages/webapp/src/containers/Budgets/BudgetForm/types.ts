import type {
  Account,
  Budget,
  CreateBudgetBody,
  EditBudgetBody,
} from '@bigcapital/sdk-ts';

export interface BudgetPeriod {
  /**
   * The month key in `YYYY-MM` format.
   */
  key: string;
  /**
   * The human readable month label.
   */
  label: string;
  /**
   * The first day of the month in `YYYY-MM-DD` format.
   */
  date: string;
}

export interface BudgetAccountRow {
  [key: string]: unknown;
  id: number;
  code: string;
  name: string;
  accountType: string;
  accountTypeLabel: string;
  rootType: string;
  isBalanceSheet: boolean;
}

export interface BudgetFormValues {
  name: string;
  description: string;
  fromDate: Date | null;
  toDate: Date | null;
  includeBalanceSheetAccounts: boolean;
  /**
   * Flat map of entry amounts keyed by `${accountId}_${periodKey}`.
   */
  entries: Record<string, string>;
}

export interface BudgetFormSubmitPayload {
  redirect?: boolean;
}

export interface BudgetFormContextValue {
  budgetId?: number;
  budget: Budget | undefined;
  accounts: Account[];
  accountRows: BudgetAccountRow[];
  fiscalYear?: string;
  isNewMode: boolean;
  isFormLoading: boolean;
  setSubmitPayload: (payload: BudgetFormSubmitPayload) => void;
  getSubmitPayload: () => BudgetFormSubmitPayload;
  createBudgetMutate: (values: CreateBudgetBody) => Promise<unknown>;
  editBudgetMutate: (args: [number, EditBudgetBody]) => Promise<unknown>;
}
