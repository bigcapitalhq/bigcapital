

export interface IBillPaymentEntry {
  id?: number,
  billPaymentId: number,
  billId: number,
  paymentAmount: number,
};

export interface IBillPayment {
  id?: number,
  vendorId: number,
  amount: number,
  reference: string,
  paymentAccountId: number,
  paymentNumber: string,
  paymentDate: Date,
  userId: number,
  entries: IBillPaymentEntry[],
  statement: string,
}

export interface IBillPaymentEntryDTO {
  billId: number,
  paymentAmount: number,
};

export interface IBillPaymentDTO {
  vendorId: number,
  paymentAccountId: number,
  paymentNumber?: string,
  paymentDate: Date,
  statement: string,
  reference: string,
  entries: IBillPaymentEntryDTO[],
};

export interface IBillReceivePageEntry {
  billId: number,
  entryType: string,
  billNo: string,
  dueAmount: number,
  amount: number,
  totalPaymentAmount: number,
  paymentAmount: number,
  currencyCode: string,
  date: Date|string,
};