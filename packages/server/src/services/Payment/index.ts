import { IPaymentMethod, IPaymentContext } from "interfaces";
import { Plan } from '@/system/models';

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
  makePayment(paymentModel: PaymentModel, plan: Plan) {
    return this.paymentMethod.payment(paymentModel, plan);
  }
}