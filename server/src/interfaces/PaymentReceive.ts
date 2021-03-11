
import { IDynamicListFilterDTO } from "./DynamicFilter";

export interface IPaymentReceive {
  id?: number,
  customerId: number,
  paymentDate: Date,
  amount: number,
  referenceNo: string,
  depositAccountId: number,
  paymentReceiveNo: string,
  statement: string,
  entries: IPaymentReceiveEntry[],
  userId: number,
};
export interface IPaymentReceiveCreateDTO {
  customerId: number,
  paymentDate: Date,
  amount: number,
  referenceNo: string,
  depositAccountId: number,
  paymentReceiveNo?: string,
  statement: string,
  entries: IPaymentReceiveEntryDTO[],
};

export interface IPaymentReceiveEditDTO {
  customerId: number,
  paymentDate: Date,
  amount: number,
  referenceNo: string,
  depositAccountId: number,
  paymentReceiveNo?: string,
  statement: string,
  entries: IPaymentReceiveEntryDTO[],
};

export interface IPaymentReceiveEntry {
  id?: number,
  paymentReceiveId: number,
  invoiceId: number,
  paymentAmount: number,
};

export interface IPaymentReceiveEntryDTO {
  id?: number,
  paymentReceiveId: number,
  invoiceId: number,
  paymentAmount: number,
};

export interface IPaymentReceivesFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
}

export interface IPaymentReceivePageEntry {
  invoiceId: number,
  entryType: string,
  invoiceNo: string,
  dueAmount: number,
  amount: number,
  totalPaymentAmount: number,
  paymentAmount: number,
  date: Date|string,
};

export interface IPaymentReceiveEditPage {
  paymentReceive: IPaymentReceive,
  entries: IPaymentReceivePageEntry[];
};