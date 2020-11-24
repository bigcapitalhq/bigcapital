

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
  description: string,
  reference: string,
  entries: IBillPaymentEntryDTO[],
};