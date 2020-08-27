

export interface IPaymentModel {}

export interface IVoucherPaymentModel extends IPaymentModel {
  voucherCode: string;
}

export interface IPaymentMethod {
  makePayment(paymentModel: IPaymentModel): Promise<boolean>;
}

export interface IVoucherPaymentMethod {
  makePayment(paymentModel: IVoucherPaymentModel): Promise<boolean>;
}

export interface IPaymentContext<PaymentModel> {
  paymentMethod: IPaymentMethod;
  makePayment(paymentModel: PaymentModel): Promise<boolean>;
}