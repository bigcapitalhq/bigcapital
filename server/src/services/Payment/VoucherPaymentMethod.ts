import { Voucher } from "@/system/models";
import PaymentMethod from '@/services/Payment/PaymentMethod';
import { IPaymentMethod, IVoucherPaymentModel } from '@/interfaces';

export default class VocuherPaymentMethod extends PaymentMethod implements IPaymentMethod {
  /**
   * Payment subscription of organization via voucher code.
   * @param {IVoucherPaymentModel}
   */
  async payment(voucherPaymentModel: IVoucherPaymentModel) {
    // Mark the voucher code as used.
    return Voucher.markVoucherAsUsed(voucherPaymentModel.voucherCode);
  }
}