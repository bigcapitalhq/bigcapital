import { IItemEntry, IItemEntryDTO } from "./ItemEntry";

export interface ISaleInvoice {
  id: number,
  balance: number,
  paymentAmount: number,
  invoiceDate: Date,
  dueDate: Date,
  dueAmount: number,
  overdueDays: number,
  customerId: number,
  referenceNo: string,
  invoiceNo: string,
  entries: IItemEntry[],
  deliveredAt: string | Date,
  userId: number,
}

export interface ISaleInvoiceDTO {
  invoiceDate: Date,
  dueDate: Date,
  referenceNo: string,
  invoiceNo: string,
  customerId: number,
  invoiceMessage: string,
  termsConditions: string,
  entries: IItemEntryDTO[],
  delivered: boolean,
}

export interface ISaleInvoiceCreateDTO extends ISaleInvoiceDTO {
  fromEstimateId: number,  
};

export interface ISaleInvoiceEditDTO extends ISaleInvoiceDTO {

};

export interface ISalesInvoicesFilter{
  page: number,
  pageSize: number,
};