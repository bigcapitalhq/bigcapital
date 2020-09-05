

export interface IPaymentModel {}

export interface ILicensePaymentModel extends IPaymentModel {
  licenseCode: string;
}

export interface IPaymentMethod {
  makePayment(paymentModel: IPaymentModel): Promise<boolean>;
}

export interface ILicensePaymentMethod {
  makePayment(paymentModel: ILicensePaymentModel): Promise<boolean>;
}

export interface IPaymentContext<PaymentModel> {
  paymentMethod: IPaymentMethod;
  makePayment(paymentModel: PaymentModel): Promise<boolean>;
}