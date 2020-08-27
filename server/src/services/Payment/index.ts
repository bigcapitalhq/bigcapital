import { IPaymentMethod, IPaymentContext } from "@/interfaces";

export default class PaymentContext<PaymentModel> implements IPaymentContext{
  paymentMethod: IPaymentMethod;

  /**
   * Constructor method. 
   * @param {IPaymentMethod} paymentMethod 
   */
  constructor(paymentMethod: IPaymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  /**
   * 
   * @param {<PaymentModel>} paymentModel 
   */
  makePayment(paymentModel: PaymentModel) {
    this.paymentMethod.makePayment(paymentModel);
  }
}