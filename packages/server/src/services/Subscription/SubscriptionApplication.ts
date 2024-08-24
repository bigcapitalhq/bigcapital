import { Inject, Service } from 'typedi';
import { LemonCancelSubscription } from './LemonCancelSubscription';
import { LemonChangeSubscriptionPlan } from './LemonChangeSubscriptionPlan';
import { LemonResumeSubscription } from './LemonResumeSubscription';

@Service()
export class SubscriptionApplication {
  @Inject()
  private cancelSubscriptionService: LemonCancelSubscription;

  @Inject()
  private resumeSubscriptionService: LemonResumeSubscription;

  @Inject()
  private changeSubscriptionPlanService: LemonChangeSubscriptionPlan;

  /**
   * Cancels the subscription of the given tenant.
   * @param {number} tenantId
   * @param {string} id
   * @returns {Promise<void>}
   */
  public cancelSubscription(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ) {
    return this.cancelSubscriptionService.cancelSubscription(
      tenantId,
      subscriptionSlug
    );
  }

  /**
   * Resumes the subscription of the given tenant.
   * @param {number} tenantId
   * @returns {Promise<void>}
   */
  public resumeSubscription(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ) {
    return this.resumeSubscriptionService.resumeSubscription(
      tenantId,
      subscriptionSlug
    );
  }

  /**
   * Changes the given organization subscription plan.
   * @param {number} tenantId
   * @param {number} newVariantId
   * @returns {Promise<void>}
   */
  public changeSubscriptionPlan(tenantId: number, newVariantId: number) {
    return this.changeSubscriptionPlanService.changeSubscriptionPlan(
      tenantId,
      newVariantId
    );
  }
}
