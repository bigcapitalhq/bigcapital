import type { useCreateLandedCost } from '@/hooks/query';
import type { Bill } from '@bigcapital/sdk-ts';

/** A single form item (loose — bill entries come back from the SDK with camelCase fields). */
export interface AllocateLandedCostItem {
  entryId: number | string;
  cost: number | string;
  [key: string]: unknown;
}

/**
 * Loose entry shape used by the distribution algorithms (allocateCostByValue,
 * allocateCostByQuantity). Reads `amount`, `quantity`, `rate`, `item.name`, `cost`.
 */
export interface AllocateLandedCostFormEntry {
  id?: number;
  entryId?: number | string;
  cost?: number | string;
  amount?: number;
  quantity?: number;
  rate?: number;
  percentageOfValue?: number;
  percentageOfQuantity?: number;
  item?: { name?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export interface AllocateLandedCostFormValues {
  transactionType: string;
  transactionId: number | string;
  transactionEntryId: number | string;
  amount: number | string;
  allocationMethod: string;
  items: AllocateLandedCostItem[];
  [key: string]: unknown;
}

export type AllocateLandedCostDialogPayload = {
  billId?: number | null;
};

/** Loose bill shape: form code reads `entries` with camelCase fields. */
export interface AllocateLandedCostBill {
  id: number;
  entries?: Array<{
    id?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

/** Landed cost transaction (loose). */
export interface LandedCostTransaction {
  id: number;
  name?: string;
  formattedUnallocatedCostAmount?: string | number;
  entries?: LandedCostTransactionEntry[];
  [key: string]: unknown;
}

export interface LandedCostTransactionEntry {
  id: number;
  name?: string;
  unallocatedCostAmount?: number;
  formattedUnallocatedCostAmount?: string;
  [key: string]: unknown;
}

export type AllocateLandedCostDialogContextValue = {
  isBillLoading: boolean;
  bill: AllocateLandedCostBill | undefined;
  dialogName: string;
  query?: Record<string, unknown>;
  createLandedCostMutate: ReturnType<typeof useCreateLandedCost>['mutateAsync'];
  costTransaction: LandedCostTransaction | null | undefined;
  costTransactionEntries: LandedCostTransactionEntry[];
  transactionsType: string;
  landedCostTransactions: LandedCostTransaction[] | undefined;
  isLandedCostTransactionsLoading: boolean;
  setTransactionsType: (t: string) => void;
  setTransactionId: (id: number | null) => void;
  setTransactionEntryId: (id: number | null) => void;
  costTransactionEntry: LandedCostTransactionEntry | null;
  transactionEntryId: number | null;
  transactionId: number | null;
  billId?: number | null;
  unallocatedCostAmount: number;
  formattedUnallocatedCostAmount: number | string;
};

// Re-export to satisfy potential external consumers.
export type { Bill };
