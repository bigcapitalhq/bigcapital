import { IItemEntry, IItemEntryDTO } from "./ItemEntry";

export interface ISaleInvoice {
  id: number,
  balance: number,
  paymentAmount: number,
  invoiceDate: Date,
  dueDate: Date,
  dueAmount: number,
  customerId: number,
  entries: IItemEntry[],
  deliveredAt: string|Date,
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
  delivered: boolean,
}

export interface ISaleInvoiceCreateDTO extends ISaleInvoiceOTD {
  fromEstiamteId: number,  
};

export interface ISaleInvoiceEditDTO extends ISaleInvoiceOTD {

};

export interface ISalesInvoicesFilter{
  page: number,
  pageSize: number,
};