import { Service, Inject } from 'typedi';
import { Plan, Tenant } from '@/system/models';
import Subscription from '@/services/Subscription/Subscription';
import LicensePaymentMethod from '@/services/Payment/LicensePaymentMethod';
import PaymentContext from '@/services/Payment';
import SubscriptionSMSMessages from '@/services/Subscription/SMSMessages';
import SubscriptionMailMessages from '@/services/Subscription/MailMessages';
import { ILicensePaymentModel } from '@/interfaces';

@Service()
export default class SubscriptionService {
  @Inject()
  smsMessages: SubscriptionSMSMessages;

  @Inject()
  mailMessages: SubscriptionMailMessages;

  @Inject('logger')
  logger: any;

  /**
   * Handles the payment process via license code and than subscribe to 
   * the given tenant.
   * @param {number} tenantId 
   * @param {String} planSlug 
   * @param {string} licenseCode 
   * @return {Promise}
   */
  async subscriptionViaLicense(
    tenantId: number,
    planSlug: string,
    paymentModel?: ILicensePaymentModel,
    subscriptionSlug: string = 'main',
  ) {
    this.logger.info('[subscription_via_license] try to subscribe via given license.', {
      tenantId, paymentModel
    });
    const plan = await Plan.query().findOne('slug', planSlug);
    const tenant = await Tenant.query().findById(tenantId);

    const paymentViaLicense = new LicensePaymentMethod();
    const paymentContext = new PaymentContext(paymentViaLicense);

    const subscription = new Subscription(paymentContext);

    await subscription.subscribe(tenant, plan, paymentModel, subscriptionSlug);
    this.logger.info('[subscription_via_license] payment via license done successfully.', {
      tenantId, paymentModel
    }); 
  }
}