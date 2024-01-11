import { IFinancialTable } from './Table';
import {
  ITransactionsByContactsAmount,
  ITransactionsByContactsTransaction,
  ITransactionsByContactsFilter,
} from './TransactionsByContacts';

export interface ITransactionsByVendorsAmount
  extends ITransactionsByContactsAmount {}

export interface ITransactionsByVendorsTransaction
  extends ITransactionsByContactsTransaction {}

export interface ITransactionsByVendorsVendor {
  vendorName: string;
  openingBalance: ITransactionsByVendorsAmount;
  closingBalance: ITransactionsByVendorsAmount;
  transactions: ITransactionsByVendorsTransaction[];
}

export interface ITransactionsByVendorsFilter
  extends ITransactionsByContactsFilter {
  vendorsIds: number[];
}

export type ITransactionsByVendorsData = ITransactionsByVendorsVendor[];

export interface ITransactionsByVendorsStatement {
  data: ITransactionsByVendorsData;
}

export interface ITransactionsByVendorsService {
  transactionsByVendors(
    tenantId: number,
    filter: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorsStatement>;
}

export interface ITransactionsByVendorTable extends IFinancialTable {
  query: ITransactionsByVendorsFilter;
}