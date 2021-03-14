import { Inject, Service } from 'typedi';
import { Tenant, Plan } from 'system/models';
import { IPaymentContext } from 'interfaces';
import { NotAllowedChangeSubscriptionPlan } from 'exceptions';
import { NoPaymentModelWithPricedPlan } from 'exceptions';

export default class Subscription<PaymentModel> {
  paymentContext: IPaymentContext|null;

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
   * Subscripe to the given plan.
   * @param  {Plan} plan 
   * @throws {NotAllowedChangeSubscriptionPlan}
   */
  async subscribe(
    tenant: Tenant,
    plan: Plan,
    paymentModel?: PaymentModel,
    subscriptionSlug: string = 'main',
  ) {
    this.validateIfPlanHasPriceNoPayment(plan, paymentModel);

    await this.paymentContext.makePayment(paymentModel, plan);

    const subscription = await tenant.$relatedQuery('subscriptions')
      .modify('subscriptionBySlug', subscriptionSlug)
      .first();

    // No allowed to re-new the the subscription while the subscription is active.
    if (subscription && subscription.active()) {
      throw new NotAllowedChangeSubscriptionPlan;

    // In case there is already subscription associated to the given tenant renew it.
    } else if(subscription && subscription.inactive()) {
      await subscription.renew(plan);

    // No stored past tenant subscriptions create new one.
    } else {
      await tenant.newSubscription(subscriptionSlug, plan);
    }        
  }

  /**
   * Throw error in plan has price and no payment model.
   * @param {Plan} plan -
   * @param {PaymentModel} paymentModel - payment input.
   */
  validateIfPlanHasPriceNoPayment(plan: Plan, paymentModel: PaymentMode) {
    if (plan.price > 0 && !paymentModel) {
      throw new NoPaymentModelWithPricedPlan();
    }
  }
}