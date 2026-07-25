import type {
  CreateExpenseBody,
  EditExpenseBody,
  Expense,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import type React from 'react';

export type ExpenseEntry = {
  index?: number | null;
  amount: string | number;
  expenseAccountId: string | number;
  description: string;
  landedCost: boolean | number;
  projectId: string | number;
};

export type ExpenseFormValues = {
  paymentAccountId: string | number;
  beneficiary: string;
  paymentDate: string;
  description: string;
  referenceNo: string;
  currencyCode: string;
  publish: boolean | '';
  branchId: string | number;
  exchangeRate: number;
  categories: ExpenseEntry[];
  attachments: unknown[];
};

export type ExpenseSubmitPayload = {
  redirect?: boolean;
  publish?: boolean;
  resetForm?: boolean;
};

export type ExpenseErrorResponse = {
  type: string;
  indexes?: number[];
  meta?: unknown[];
};

export type ExpenseFormContext = {
  isNewMode: boolean;
  expenseId: number;
  submitPayloadRef: React.MutableRefObject<ExpenseSubmitPayload>;
  currencies: Record<string, any>[];
  customers: Record<string, any>[];
  expense: Expense | undefined;
  accounts: Record<string, any>[];
  branches: Record<string, any>[];
  projects: Record<string, any>[];
  isCurrenciesLoading: boolean;
  isExpenseLoading: boolean;
  isCustomersLoading: boolean;
  isAccountsLoading: boolean;
  isBranchesSuccess: boolean;
  isBranchesLoading: boolean;
  createExpenseMutate: (data: CreateExpenseBody) => Promise<unknown>;
  editExpenseMutate: ([id, data]: [
    number,
    EditExpenseBody,
  ]) => Promise<unknown>;
  setSubmitPayload: (payload: ExpenseSubmitPayload) => void;
  expenseSettings: SettingsGroup | undefined;
};
