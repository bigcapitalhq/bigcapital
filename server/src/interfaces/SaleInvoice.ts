
export interface ISaleInvoice {
  id: number,
  balance: number,
  paymentAmount: number,
  invoiceDate: Date,
  dueDate: Date,
  entries: any[],
}

export interface ISaleInvoiceOTD {
  invoiceDate: Date,
  dueDate: Date,
  referenceNo: string,
  invoiceMessage: string,
  termsConditions: string,
  entries: any[],
}