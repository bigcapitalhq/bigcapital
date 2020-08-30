

export interface IBillPaymentEntry {
  billId: number,
  paymentAmount: number,
};

export interface IBillPayment {
  amount: number,
  reference: string,
  billNo: string,
  entries: IBillPaymentEntry[],
}

export interface IBillPaymentOTD {};