import { Service, Inject } from 'typedi';
import { Plan, Tenant, License } from '@/system/models';
import Subscription from '@/services/Subscription/Subscription';
import VocuherPaymentMethod from '@/services/Payment/LicensePaymentMethod';
import PaymentContext from '@/services/Payment';
import SubscriptionSMSMessages from '@/services/Subscription/SMSMessages';
import SubscriptionMailMessages from '@/services/Subscription/MailMessages';

@Service()
export default class SubscriptionService {
  @Inject()
  smsMessages: SubscriptionSMSMessages;

  @Inject()
  mailMessages: SubscriptionMailMessages;

  /**
   * Handles the payment process via license code and than subscribe to 
   * the given tenant.
   * 
   * @param {number} tenantId 
   * @param {String} planSlug 
   * @param {string} licenseCode 
   * 
   * @return {Promise}
   */
  async subscriptionViaLicense(
    tenantId: number,
    planSlug: string,
    licenseCode: string,
    subscriptionSlug: string = 'main',
  ) {
    const plan = await Plan.query().findOne('slug', planSlug);
    const tenant = await Tenant.query().findById(tenantId);
    const licenseModel = await License.query().findOne('license_code', licenseCode);

    const paymentViaLicense = new VocuherPaymentMethod();
    const paymentContext = new PaymentContext(paymentViaLicense);

    const subscription = new Subscription(paymentContext);

    return subscription.subscribe(tenant, plan, licenseModel, subscriptionSlug);
  }
}