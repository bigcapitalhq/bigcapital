import { Inject } from 'typedi';
import { Tenant, Plan } from 'system/models';
import { IPaymentContext } from 'interfaces';
import { NotAllowedChangeSubscriptionPlan } from 'exceptions';

export default class Subscription<PaymentModel> {
  paymentContext: IPaymentContext | null;

  @Inject('logger')
  logger: any;

  /**
   * Constructor method.
   * @param {IPaymentContext}
   */
  constructor(payment?: IPaymentContext) {
    this.paymentContext = payment;
  }

  /**
   * Give the tenant a new subscription.
   * @param {Tenant} tenant
   * @param {Plan} plan
   * @param {string} invoiceInterval
   * @param {number} invoicePeriod
   * @param {string} subscriptionSlug
   */
  protected async newSubscribtion(
    tenant,
    plan,
    invoiceInterval: string,
    invoicePeriod: number,
    subscriptionSlug: string = 'main'
  ) {
    const subscription = await tenant
      .$relatedQuery('subscriptions')
      .modify('subscriptionBySlug', subscriptionSlug)
      .first();

    // No allowed to re-new the the subscription while the subscription is active.
    if (subscription && subscription.active()) {
      throw new NotAllowedChangeSubscriptionPlan();

      // In case there is already subscription associated to the given tenant renew it.
    } else if (subscription && subscription.inactive()) {
      await subscription.renew(invoiceInterval, invoicePeriod);

      // No stored past tenant subscriptions create new one.
    } else {
      await tenant.newSubscription(
        plan.id,
        invoiceInterval,
        invoicePeriod,
        subscriptionSlug
      );
    }
  }

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
  ) {
    await this.paymentContext.makePayment(paymentModel, plan);

    return this.newSubscribtion(
      tenant,
      plan,
      plan.invoiceInterval,
      plan.invoicePeriod,
      subscriptionSlug
    );
  }
}
