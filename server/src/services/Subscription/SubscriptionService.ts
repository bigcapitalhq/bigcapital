import { Service, Inject } from 'typedi';
import { Plan, Tenant, Voucher } from '@/system/models';
import Subscription from '@/services/Subscription/Subscription';
import VocuherPaymentMethod from '@/services/Payment/VoucherPaymentMethod';
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
   * Handles the payment process via voucher code and than subscribe to 
   * the given tenant.
   * 
   * @param {number} tenantId 
   * @param {String} planSlug 
   * @param {string} voucherCode 
   * 
   * @return {Promise}
   */
  async subscriptionViaVoucher(
    tenantId: number,
    planSlug: string,
    voucherCode: string,
    subscriptionSlug: string = 'main',
  ) {
    const plan = await Plan.query().findOne('slug', planSlug);
    const tenant = await Tenant.query().findById(tenantId);
    const voucherModel = await Voucher.query().findOne('voucher_code', voucherCode);

    const paymentViaVoucher = new VocuherPaymentMethod();
    const paymentContext = new PaymentContext(paymentViaVoucher);

    const subscription = new Subscription(paymentContext);

    return subscription.subscribe(tenant, plan, voucherModel, subscriptionSlug);
  }
}