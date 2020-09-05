import { License } from "@/system/models";
import PaymentMethod from '@/services/Payment/PaymentMethod';
import { IPaymentMethod, ILicensePaymentModel } from '@/interfaces';

export default class VocuherPaymentMethod extends PaymentMethod implements IPaymentMethod {
  /**
   * Payment subscription of organization via license code.
   * @param {ILicensePaymentModel}
   */
  async payment(licensePaymentModel: ILicensePaymentModel) {
    // Mark the license code as used.
    return License.markLicenseAsUsed(licensePaymentModel.licenseCode);
  }
}