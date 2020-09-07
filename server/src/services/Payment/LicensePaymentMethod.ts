import { License } from "@/system/models";
import PaymentMethod from '@/services/Payment/PaymentMethod';
import { Plan } from '@/system/models';
import { IPaymentMethod, ILicensePaymentModel } from '@/interfaces';
import { ILicensePaymentModel } from "@/interfaces";
import { PaymentInputInvalid, PaymentAmountInvalidWithPlan } from '@/exceptions';

export default class LicensePaymentMethod extends PaymentMethod implements IPaymentMethod {
  /**
   * Payment subscription of organization via license code.
   * @param {ILicensePaymentModel} licensePaymentModel -
   */
  async payment(licensePaymentModel: ILicensePaymentModel, plan: Plan) {
    const license = await this.getLicenseOrThrowInvalid(licensePaymentModel);
    this.validatePaymentAmountWithPlan(license, plan);

    // Mark the license code as used.
    return License.markLicenseAsUsed(licensePaymentModel.licenseCode);
  }

  /**
   * Validates the license code activation on the storage.
   * @param {ILicensePaymentModel} licensePaymentModel -
   */
  async getLicenseOrThrowInvalid(licensePaymentModel: ILicensePaymentModel) {
    const foundLicense = await License.query()
      .modify('filterActiveLicense')
      .where('license_code', licensePaymentModel.licenseCode)
      .first();

    if (!foundLicense) {
      throw new PaymentInputInvalid();
    }
    return foundLicense;
  }

  /**
   * Validates the payment amount with given plan price.
   * @param {License} license 
   * @param {Plan} plan 
   */
  validatePaymentAmountWithPlan(license: License, plan: Plan) {
    if (license.planId !== plan.id) {
      throw new PaymentAmountInvalidWithPlan();
    }
  }
}