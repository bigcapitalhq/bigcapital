import { Service, Inject } from 'typedi';
import { Plan, PlanSubscription, Tenant } from '@/system/models';
import Subscription from '@/services/Subscription/Subscription';
import LicensePaymentMethod from '@/services/Payment/LicensePaymentMethod';
import PaymentContext from '@/services/Payment';
import SubscriptionSMSMessages from '@/services/Subscription/SMSMessages';
import SubscriptionMailMessages from '@/services/Subscription/MailMessages';
import { ILicensePaymentModel } from '@/interfaces';
import SubscriptionViaLicense from './SubscriptionViaLicense';

@Service()
export default class SubscriptionService {
  @Inject()
  smsMessages: SubscriptionSMSMessages;

  @Inject()
  mailMessages: SubscriptionMailMessages;

  @Inject('logger')
  logger: any;

  @Inject('repositories')
  sysRepositories: any;

  /**
   * Handles the payment process via license code and than subscribe to
   * the given tenant.
   * @param {number} tenantId
   * @param {String} planSlug
   * @param {string} licenseCode
   * @return {Promise}
   */
  public async subscriptionViaLicense(
    tenantId: number,
    planSlug: string,
    paymentModel: ILicensePaymentModel,
    subscriptionSlug: string = 'main'
  ) {
    // Retrieve plan details.
    const plan = await Plan.query().findOne('slug', planSlug);

    // Retrieve tenant details.
    const tenant = await Tenant.query().findById(tenantId);

    // License payment method.
    const paymentViaLicense = new LicensePaymentMethod();

    // Payment context.
    const paymentContext = new PaymentContext(paymentViaLicense);

    // Subscription.
    const subscription = new SubscriptionViaLicense(paymentContext);

    // Subscribe.
    await subscription.subscribe(tenant, plan, paymentModel, subscriptionSlug);
  }

  /**
   * Retrieve all subscription of the given tenant.
   * @param {number} tenantId
   */
  public async getSubscriptions(tenantId: number) {
    const subscriptions = await PlanSubscription.query().where(
      'tenant_id',
      tenantId
    );
    return subscriptions;
  }
}
