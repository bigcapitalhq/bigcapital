export interface ITransactionsLockingAllDTO {
  lockToDate: Date;
  reason: string;
}
export type ITransactionsLockingCashflowDTO = {};
export type ITransactionsLockingSalesDTO = {};
export type ITransactionsLockingPurchasesDTO = {};

export enum TransactionsLockingGroup {
  All = 'all',
  Sales = 'sales',
  Purchases = 'purchases',
  Financial = 'financial',
}

export enum TransactionsLockingType {
  Partial = 'partial',
  All = 'all',
}

export interface ITransactionsLockingPartialUnlocked {
  tenantId: number;
  module: TransactionsLockingGroup;
  transactionLockingDTO: ITransactionsLockingAllDTO;
}

export interface ITransactionsLockingCanceled {
  tenantId: number;
  module: TransactionsLockingGroup;
  cancelLockingDTO: ICancelTransactionsLockingDTO;
}

export interface ITransactionLockingPartiallyDTO {
  unlockFromDate: Date;
  unlockToDate: Date;
  reason: string;
}
export interface ICancelTransactionsLockingDTO {
  reason: string;
}
export interface ITransactionMeta {
  isEnabled: boolean;
  isPartialUnlock: boolean;
  lockToDate: Date;
  unlockFromDate: string;
  unlockToDate: string;
  lockReason: string;
  unlockReason: string;
  partialUnlockReason: string;
}

export interface ITransactionLockingMetaPOJO {
  module: string;
  formattedModule: string;
  description: string;

  formattedLockToDate: Date;
  formattedUnlockFromDate: string;
  formattedunlockToDate: string;
}
export interface ITransactionsLockingListPOJO {
  lockingType: string;
  all: ITransactionLockingMetaPOJO;
  modules: ITransactionLockingMetaPOJO[];
}

export interface ITransactionsLockingSchema {
  module: TransactionsLockingGroup;
  formattedModule: string;
  description: string;
}
