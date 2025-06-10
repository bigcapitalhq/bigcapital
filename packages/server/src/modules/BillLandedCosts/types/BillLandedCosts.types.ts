import { Knex } from 'knex';
import { Bill } from '@/modules/Bills/models/Bill';

export interface ILandedCostItemDTO {
  entryId: number;
  cost: number;
}
export type ILandedCostType = 'Expense' | 'Bill';

export interface ILandedCostDTO {
  transactionType: ILandedCostType;
  transactionId: number;
  transactionEntryId: number;
  allocationMethod: string;
  description: string;
  items: ILandedCostItemDTO[];
}

export interface ILandedCostQueryDTO {
  vendorId: number;
  fromDate: Date;
  toDate: Date;
}

export interface IUnallocatedListCost {
  costNumber: string;
  costAmount: number;
  unallocatedAmount: number;
}

export interface ILandedCostTransactionsQueryDTO {
  transactionType: string;
  date: Date;
}

export interface ILandedCostEntriesQueryDTO {
  transactionType: string;
  transactionId: number;
}

export interface ILandedCostTransaction {
  id: number;
  name: string;
  amount: number;
  allocatedCostAmount: number;
  unallocatedCostAmount: number;
  currencyCode: string;
  exchangeRate: number;
  // formattedAllocatedCostAmount: string;
  // formattedAmount: string;
  // formattedUnallocatedCostAmount: string;
  transactionType: string;
  entries?: ILandedCostTransactionEntry[];
}

export interface ILandedCostTransactionEntry {
  id: number;
  name: string;
  code: string;
  amount: number;
  unallocatedCostAmount: number;
  allocatedCostAmount: number;
  description: string;
  costAccountId: number;
}

export interface ILandedCostTransactionEntryDOJO
  extends ILandedCostTransactionEntry {
  formattedAmount: string;
  formattedUnallocatedCostAmount: string;
  formattedAllocatedCostAmount: string;
}
export interface ILandedCostTransactionDOJO extends ILandedCostTransaction {
  formattedAmount: string;
  formattedUnallocatedCostAmount: string;
  formattedAllocatedCostAmount: string;
}

interface ILandedCostEntry {
  id: number;
  landedCost?: boolean;
}

export interface IBillLandedCostTransaction {
  id: number;
  fromTransactionId: number;
  fromTransactionType: string;
  fromTransactionEntryId: number;

  billId: number;
  allocationMethod: string;
  costAccountId: number;
  description: string;

  amount: number;
  localAmount?: number;
  currencyCode: string;
  exchangeRate: number;

  allocateEntries?: IBillLandedCostTransactionEntry[];
}

export interface IBillLandedCostTransactionEntry {
  cost: number;
  entryId: number;
  billLocatedCostId: number;
}

export interface IAllocatedLandedCostDeletedPayload {
  oldBillLandedCost: IBillLandedCostTransaction;
  billId: number;
  trx: Knex.Transaction;
}

export interface IAllocatedLandedCostCreatedPayload {
  bill: Bill;
  billLandedCostId: number;
  billLandedCost: IBillLandedCostTransaction;
  trx: Knex.Transaction;
}

export interface IBillAssociatedLandedCostTransactions {}


interface ICommonEntry {
  id?: number;
  amount: number;
}

export interface ICommonLandedCostEntry extends ICommonEntry {
  landedCost: boolean;
  allocatedCostAmount: number;
}

interface ICommonEntryDTO {
  id?: number;
  amount: number;
}

export interface ICommonLandedCostEntryDTO extends ICommonEntryDTO {
  landedCost?: boolean;
}
