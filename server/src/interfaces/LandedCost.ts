export interface IBillLandedCost {
  fromTransactionId: number;
  fromTransactionType: string;
  amount: number;
  BillId: number;
}

export interface IBillLandedCostEntry {
  id?: number,
  cost: number,
  entryId: number,
  billLocatedCostId: number,
}

export interface ILandedCostItemDTO {
  entryId: number,
  cost: number;
}
export  type ILandedCostType = 'Expense' | 'Bill';

export interface ILandedCostDTO {
  transactionType: ILandedCostType;
  transactionId: number;
  transactionEntryId: number,
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
  transactionType: string,
  date: Date,
}

export interface ILandedCostEntriesQueryDTO {
  transactionType: string,
  transactionId: number,
}

export interface ILandedCostTransaction {
  id: number;
  name: string;
  amount: number;
  allocatedCostAmount: number;
  unallocatedCostAmount: number;
  transactionType: string;
  entries?: ILandedCostTransactionEntry[];
}

export interface ILandedCostTransactionEntry {
  id: number;
  name: string;
  code: string;
  amount: number;
  description: string;
}

interface ILandedCostEntry {
  id: number;
  landedCost?: boolean;
}

export interface IBillLandedCostTransaction { 
  id: number,
  fromTranscationId: number,
  fromTransactionType: string;
  fromTransactionEntryId: number;

  billId: number,
  allocationMethod: string;
  costAccountId: number,
  description: string;

  allocatedEntries?: IBillLandedCostTransactionEntry[],
};

export interface IBillLandedCostTransactionEntry {
  cost: number;
  entryId: number;
  billLocatedCostId: number,
}