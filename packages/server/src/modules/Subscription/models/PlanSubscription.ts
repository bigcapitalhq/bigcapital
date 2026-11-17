import { Model, mixin } from 'objection';
import * as moment from 'moment';
import { SubscriptionPeriod } from '../SubscriptionPeriod';
import { SystemModel } from '@/modules/System/models/SystemModel';
import { SubscriptionPaymentStatus } from '@/interfaces/SubscriptionPlan';

export class PlanSubscription extends mixin(SystemModel) {
  public readonly lemonSubscriptionId!: string;
  public readonly stripeSubscriptionId!: string;
  public readonly stripeStatus!: string;
  public readonly stripePriceId!: string;
  public readonly cancelAtPeriodEnd!: boolean;
  public readonly slug: string;
  public readonly endsAt!: Date;
  public readonly startsAt!: Date;
  public readonly canceledAt!: Date;
  public readonly trialEndsAt!: Date;
  public readonly paymentStatus!: SubscriptionPaymentStatus;
  public readonly tenantId!: number;
  public readonly planId!: number;

  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_plan_subscriptions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'active',
      'inactive',
      'ended',
      'canceled',
      'onTrial',
      'status',
      'isPaymentFailed',
      'isPaymentSucceed',
    ];
  }

  /**
   * Modifiers queries.
   */
  static get modifiers() {
    return {
      activeSubscriptions(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const now = moment().format(dateFormat);

        builder.where('ends_at', '>', now);
        builder.where('trial_ends_at', '>', now);
      },

      inactiveSubscriptions(builder) {
        builder.modify('endedTrial');
        builder.modify('endedPeriod');
      },

      subscriptionBySlug(builder, subscriptionSlug) {
        builder.where('slug', subscriptionSlug);
      },

      endedTrial(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('ends_at', '<=', endDate);
      },

      endedPeriod(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('trial_ends_at', '<=', endDate);
      },

      /**
       * Filter the failed payment.
       * @param builder
       */
      failedPayment(builder) {
        builder.where('payment_status', SubscriptionPaymentStatus.Failed);
      },

      /**
       * Filter the succeed payment.
       * @param builder
       */
      succeedPayment(builder) {
        builder.where('payment_status', SubscriptionPaymentStatus.Succeed);
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const { TenantModel } = require('../../System/models/TenantModel');
    const { Plan } = require('./Plan');

    return {
      /**
       * Plan subscription belongs to tenant.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantModel,
        join: {
          from: 'subscription_plan_subscriptions.tenantId',
          to: 'tenants.id',
        },
      },

      /**
       * Plan description belongs to plan.
       */
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan,
        join: {
          from: 'subscription_plan_subscriptions.planId',
          to: 'subscription_plans.id',
        },
      },
    };
  }

  /**
   * Check if the subscription is active.
   * Crtiria should be active:
   *  - During the trial period should NOT be canceled.
   *  - Out of trial period should NOT be ended.
   * @return {Boolean}
   */
  public active() {
    // Stripe is the source of truth for Cloud subscriptions. `past_due` is
    // intentionally treated as active to allow Stripe's dunning retries.
    if (this.stripeStatus) {
      return ['active', 'trialing', 'past_due'].includes(this.stripeStatus);
    }

    const hasBillingProvider = !!(
      this.stripeSubscriptionId || this.lemonSubscriptionId
    );

    // A local (provider-less) trial ends when `trialEndsAt` passes, even if a
    // future paid period was stored on the subscription.
    if (this.trialEndsAt && !hasBillingProvider) {
      return this.onTrial() && !this.canceled();
    }
    return this.onTrial() ? !this.canceled() : !this.ended();
  }

  /**
   * Check if the subscription is inactive.
   * @return {Boolean}
   */
  public inactive() {
    return !this.active();
  }

  /**
   * Check if paid subscription period has ended.
   * @return {Boolean}
   */
  public ended() {
    return this.endsAt ? moment().isAfter(this.endsAt) : false;
  }

  /**
   * Check if the paid subscription has started.
   * @returns {Boolean}
   */
  public started() {
    return this.startsAt ? moment().isAfter(this.startsAt) : false;
  }

  /**
   * Check if subscription is currently on trial.
   * @return {Boolean}
   */
  public onTrial() {
    return this.trialEndsAt ? moment().isBefore(this.trialEndsAt) : false;
  }

  /**
   * Check if a provider-less trial has already expired.
   * @returns {boolean}
   */
  public trialExpired() {
    const hasBillingProvider = !!(
      this.stripeSubscriptionId || this.lemonSubscriptionId
    );
    return !!this.trialEndsAt && !hasBillingProvider && !this.onTrial();
  }

  /**
   * Check if the subscription is canceled.
   * @returns {boolean}
   */
  public canceled() {
    if (this.stripeStatus) {
      return this.stripeStatus === 'canceled';
    }
    return !!this.canceledAt;
  }

  /**
   * Retrieves the subscription status.
   * @returns {string}
   */
  public status() {
    if (this.stripeStatus) {
      if (this.stripeStatus === 'trialing') return 'on_trial';
      if (this.stripeStatus === 'active') return 'active';
      if (this.stripeStatus === 'past_due' || this.stripeStatus === 'unpaid') {
        return 'past_due';
      }
      if (this.stripeStatus === 'canceled') return 'canceled';
      return 'inactive';
    }
    return this.canceled()
      ? 'canceled'
      : this.onTrial()
        ? 'on_trial'
        : this.active()
          ? 'active'
          : 'inactive';
  }

  /**
   * Set new period from the given details.
   * @param {string} invoiceInterval
   * @param {number} invoicePeriod
   * @param {string} start
   *
   * @return {Object}
   */
  static setNewPeriod(invoiceInterval: any, invoicePeriod: any, start?: any) {
    const period = new SubscriptionPeriod(
      invoiceInterval,
      invoicePeriod,
      start,
    );

    const startsAt = period.getStartDate();
    const endsAt = period.getEndDate();

    return { startsAt, endsAt };
  }

  /**
   * Renews subscription period.
   * @Promise
   */
  renew(invoiceInterval, invoicePeriod) {
    const { startsAt, endsAt } = PlanSubscription.setNewPeriod(
      invoiceInterval,
      invoicePeriod,
    );
    return this.$query().update({ startsAt, endsAt });
  }

  /**
   * Detarmines the subscription payment whether is failed.
   * @returns {boolean}
   */
  public isPaymentFailed() {
    return this.paymentStatus === SubscriptionPaymentStatus.Failed;
  }

  /**
   * Detarmines the subscription payment whether is succeed.
   * @returns {boolean}
   */
  public isPaymentSucceed() {
    return this.paymentStatus === SubscriptionPaymentStatus.Succeed;
  }
}
