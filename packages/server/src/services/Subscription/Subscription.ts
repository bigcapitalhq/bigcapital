import { Inject, Service } from 'typedi';
import { NotAllowedChangeSubscriptionPlan, ServiceError } from '@/exceptions';
import { Plan, PlanSubscription, Tenant } from '@/system/models';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { SubscriptionPayload, SubscriptionPaymentStatus } from '@/interfaces';
import { ERRORS } from './types';

@Service()
export class Subscription {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Give the tenant a new subscription.
   * @param {number} tenantId - Tenant id.
   * @param {string} planSlug - Plan slug of the new subscription.
   * @param {string} subscriptionSlug - Subscription slug by default takes main subscription
   * @param {SubscriptionPayload} payload - Subscription payload.
   */
  public async newSubscribtion(
    tenantId: number,
    planSlug: string,
    subscriptionSlug: string = 'main',
    payload?: SubscriptionPayload
  ): Promise<void> {
    const tenant = await Tenant.query().findById(tenantId).throwIfNotFound();
    const plan = await Plan.query().findOne('slug', planSlug).throwIfNotFound();

    const isFree = plan.price === 0;

    // Take the invoice interval and period from the given plan.
    const invoiceInterval = plan.invoiceInternal;
    const invoicePeriod = isFree ? Infinity : plan.invoicePeriod;

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
        subscriptionSlug,
        payload
      );
    }
  }

  /**
   * Cancels the given tenant subscription.
   * @param {number} tenantId - Tenant id.
   * @param {string} subscriptionSlug - Subscription slug.
   */
  async cancelSubscription(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    const tenant = await Tenant.query().findById(tenantId).throwIfNotFound();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: subscriptionSlug,
    });
    // Throw error early if the subscription is not exist.
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_NOT_EXIST);
    }
    // Throw error early if the subscription is already canceled.
    if (subscription.canceled()) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ALREADY_CANCELED);
    }
    await subscription.$query().patch({ canceledAt: new Date() });

    // Triggers `onSubscriptionCancelled` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionCancelled,
      {
        tenantId,
        subscriptionSlug,
      }
    );
  }

  /**
   * Resumes the given tenant subscription.
   * @param {number} tenantId
   * @param {string} subscriptionSlug  - Subscription slug by deafult main subscription.
   * @returns {Promise<void>}
   */
  async resumeSubscription(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ) {
    const tenant = await Tenant.query().findById(tenantId).throwIfNotFound();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: subscriptionSlug,
    });
    // Throw error early if the subscription is not exist.
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_NOT_EXIST);
    }
    // Throw error early if the subscription is not cancelled.
    if (!subscription.canceled()) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ALREADY_ACTIVE);
    }
    await subscription.$query().patch({ canceledAt: null });

    // Triggers `onSubscriptionResumed` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionResumed,
      { tenantId, subscriptionSlug }
    );
  }

  /**
   * Mark the given subscription payment of the tenant as succeed.
   * @param {number} tenantId
   * @param {string} newPlanSlug
   * @param {string} subscriptionSlug
   */
  async subscriptionPlanChanged(
    tenantId: number,
    newPlanSlug: string,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    const tenant = await Tenant.query().findById(tenantId).throwIfNotFound();
    const newPlan = await Plan.query()
      .findOne('slug', newPlanSlug)
      .throwIfNotFound();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: subscriptionSlug,
    });
    if (subscription.planId === newPlan.id) {
      throw new ServiceError('');
    }
    await subscription.$query().patch({ planId: newPlan.id });

    // Triggers `onSubscriptionPlanChanged` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionPlanChanged,
      {
        tenantId,
        newPlanSlug,
        subscriptionSlug,
      }
    );
  }

  /**
   * Marks the subscription payment as succeed.
   * @param {number} tenantId - Tenant id.
   * @param {string} subscriptionSlug - Given subscription slug by default main subscription.
   * @returns {Promise<void>}
   */
  async markSubscriptionPaymentSucceed(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    const subscription = await PlanSubscription.query()
      .findOne({ tenantId, slug: subscriptionSlug })
      .throwIfNotFound();

    await subscription
      .$query()
      .patch({ paymentStatus: SubscriptionPaymentStatus.Succeed });

    // Triggers `onSubscriptionSucceed` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionPaymentSucceed,
      {
        tenantId,
        subscriptionSlug,
      }
    );
  }

  /**
   * Marks the given subscription payment of the tenant as failed.
   * @param {number} tenantId - Tenant id.
   * @param {string} subscriptionSlug - Given subscription slug.
   * @returns {Prmise<void>}
   */
  async markSubscriptionPaymentFailed(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ): Promise<void> {
    const subscription = await PlanSubscription.query()
      .findOne({ tenantId, slug: subscriptionSlug })
      .throwIfNotFound();

    await subscription
      .$query()
      .patch({ paymentStatus: SubscriptionPaymentStatus.Failed });

    // Triggers `onSubscriptionPaymentFailed` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionPaymentFailed,
      {
        tenantId,
        subscriptionSlug,
      }
    );
  }
}
