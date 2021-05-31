import {
  INumberFormatQuery,
} from './FinancialStatements';

export interface IInventoryDetailsQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
}

export interface IInventoryDetailsNumber {
  number: number;
  formattedNumber: string;
}

export interface IInventoryDetailsMoney {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IInventoryDetailsDate {
  date: Date;
  formattedDate: string;
}

export interface IInventoryDetailsOpening {
  nodeType: 'OPENING_ENTRY';
  date: IInventoryDetailsDate;
  quantity: IInventoryDetailsNumber;
  value: IInventoryDetailsNumber;
}

export interface IInventoryDetailsClosing extends IInventoryDetailsOpening {
  nodeType: 'CLOSING_ENTRY';
}

export interface IInventoryDetailsItem {
  id: number;
  nodeType: string;
  name: string;
  code: string;
  children: (
    | IInventoryDetailsItemTransaction
    | IInventoryDetailsOpening
    | IInventoryDetailsClosing
  )[];
}

export interface IInventoryDetailsItemTransaction {
  nodeType: string;
  date: IInventoryDetailsDate;
  transactionType: string;
  transactionNumber: string;

  quantityMovement: IInventoryDetailsNumber;
  valueMovement: IInventoryDetailsNumber;

  quantity: IInventoryDetailsNumber;
  value: IInventoryDetailsNumber;
  cost: IInventoryDetailsNumber;
  profitMargin: IInventoryDetailsNumber;
  
  rate: IInventoryDetailsNumber;

  runningQuantity: IInventoryDetailsNumber;
  runningValuation: IInventoryDetailsNumber;

  direction: string;
}

export type IInventoryDetailsNode =
  | IInventoryDetailsItem
  | IInventoryDetailsItemTransaction;
export type IInventoryDetailsData = IInventoryDetailsItem[];
