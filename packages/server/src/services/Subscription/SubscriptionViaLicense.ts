import { License, Tenant, Plan } from '@/system/models';
import Subscription from './Subscription';
import { PaymentModel } from '@/interfaces';

export default class SubscriptionViaLicense extends Subscription<PaymentModel> {
  /**
   * Subscripe to the given plan.
   * @param {Plan} plan
   * @throws {NotAllowedChangeSubscriptionPlan}
   */
  public async subscribe(
    tenant: Tenant,
    plan: Plan,
    paymentModel?: PaymentModel,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    await this.paymentContext.makePayment(paymentModel, plan);

    return this.newSubscriptionFromLicense(
      tenant,
      plan,
      paymentModel.licenseCode,
      subscriptionSlug
    );
  }

  /**
   * New subscription from the given license.
   * @param {Tanant} tenant 
   * @param {Plab} plan 
   * @param {string} licenseCode 
   * @param {string} subscriptionSlug 
   * @returns {Promise<void>}
   */
  private async newSubscriptionFromLicense(
    tenant,
    plan,
    licenseCode: string,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    // License information.
    const licenseInfo = await License.query().findOne(
      'licenseCode',
      licenseCode
    );
    return this.newSubscribtion(
      tenant,
      plan,
      licenseInfo.periodInterval,
      licenseInfo.licensePeriod,
      subscriptionSlug
    );
  }
}
