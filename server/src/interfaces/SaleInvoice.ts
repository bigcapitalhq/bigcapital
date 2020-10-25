import { IItemEntry, IItemEntryDTO } from "./ItemEntry";

export interface ISaleInvoice {
  id: number,
  balance: number,
  paymentAmount: number,
  invoiceDate: Date,
  dueDate: Date,
  entries: IItemEntry[],
}

export interface ISaleInvoiceOTD {
  invoiceDate: Date,
  dueDate: Date,
  referenceNo: string,
  invoiceNo: string,
  customerId: number,
  invoiceMessage: string,
  termsConditions: string,
  entries: IItemEntryDTO[],
}

export interface ISalesInvoicesFilter{
  page: number,
  pageSize: number,
};