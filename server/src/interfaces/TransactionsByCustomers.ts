import {
  ITransactionsByContactsAmount,
  ITransactionsByContactsTransaction,
  ITransactionsByContactsFilter,
} from './TransactionsByContacts';

export interface ITransactionsByCustomersAmount
  extends ITransactionsByContactsAmount {}

export interface ITransactionsByCustomersTransaction
  extends ITransactionsByContactsTransaction {}

export interface ITransactionsByCustomersCustomer {
  customerName: string;
  openingBalance: ITransactionsByCustomersAmount;
  closingBalance: ITransactionsByCustomersAmount;
  transactions: ITransactionsByCustomersTransaction[];
}

export interface ITransactionsByCustomersFilter
  extends ITransactionsByContactsFilter {}

export type ITransactionsByCustomersData = ITransactionsByCustomersCustomer[];

export interface ITransactionsByCustomersStatement {
  data: ITransactionsByCustomersData;
}

export interface ITransactionsByCustomersService {
  transactionsByCustomers(
    tenantId: number,
    filter: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement>;
}
