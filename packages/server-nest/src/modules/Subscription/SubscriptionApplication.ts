import { Injectable } from '@nestjs/common';
import { CancelLemonSubscription } from './commands/CancelLemonSubscription.service';
import { ResumeLemonSubscription } from './commands/ResumeLemonSubscription.service';
import { ChangeLemonSubscription } from './commands/ChangeLemonSubscription.service';
import { MarkSubscriptionPaymentFailed } from './commands/MarkSubscriptionPaymentFailed.service';
import { MarkSubscriptionPaymentSucceed } from './commands/MarkSubscriptionPaymentSuccessed.service';
import { MarkSubscriptionCanceled } from './commands/MarkSubscriptionCanceled.service';
import { NewSubscriptionService } from './commands/NewSubscription.service';
import { SubscriptionPayload } from '@/interfaces/SubscriptionPlan';
import { MarkSubscriptionPlanChanged } from './commands/MarkSubscriptionChanged.service';
import { GetLemonSqueezyCheckoutService } from './queries/GetLemonSqueezyCheckout.service';
import { GetSubscriptionsService } from './queries/GetSubscriptions.service';
import { MarkSubscriptionResumedService } from './commands/MarkSubscriptionResumed.sevice';

@Injectable()
export class SubscriptionApplication {
  constructor(
    private readonly cancelSubscriptionService: CancelLemonSubscription,
    private readonly resumeSubscriptionService: ResumeLemonSubscription,
    private readonly changeSubscriptionPlanService: ChangeLemonSubscription,
    private readonly markSubscriptionPaymentSuccessedService: MarkSubscriptionPaymentSucceed,
    private readonly markSubscriptionPaymentFailedService: MarkSubscriptionPaymentFailed,
    private readonly markSubscriptionCanceledService: MarkSubscriptionCanceled,
    private readonly markSubscriptionPlanChangedService: MarkSubscriptionPlanChanged,
    private readonly markSubscriptionResumedService: MarkSubscriptionResumedService,
    private readonly createNewSubscriptionService: NewSubscriptionService,
    private readonly getSubscriptionsService: GetSubscriptionsService,
    private readonly getLemonSqueezyCheckoutService: GetLemonSqueezyCheckoutService,
  ) {}

  /**
   *
   * @returns
   */
  getSubscriptions() {
    return this.getSubscriptionsService.getSubscriptions();
  }

  /**
   *
   * @param variantId
   * @returns
   */
  getLemonSqueezyCheckaoutUri(variantId: number) {
    return this.getLemonSqueezyCheckoutService.getCheckout(variantId);
  }

  /**
   * Creates a new subscription of the current tenant.
   * @param {string} planSlug
   * @param {string} subscriptionSlug
   * @param {SubscriptionPayload} payload
   * @returns
   */
  public createNewSubscription(
    planSlug: string,
    subscriptionSlug: string = 'main',
    payload?: SubscriptionPayload,
  ) {
    return this.createNewSubscriptionService.execute(
      planSlug,
      subscriptionSlug,
      payload,
    );
  }

  /**
   * Cancels the subscription of the given tenant.
   * @param {string} id
   * @returns {Promise<void>}
   */
  public cancelSubscription(subscriptionSlug: string = 'main') {
    return this.cancelSubscriptionService.cancelSubscription(subscriptionSlug);
  }

  /**
   * Resumes the subscription of the given tenant.
   * @returns {Promise<void>}
   */
  public resumeSubscription(subscriptionSlug: string = 'main') {
    return this.resumeSubscriptionService.resumeSubscription(subscriptionSlug);
  }

  /**
   * Changes the given organization subscription plan.
   * @param {number} newVariantId
   * @returns {Promise<void>}
   */
  public changeSubscriptionPlan(newVariantId: number) {
    return this.changeSubscriptionPlanService.changeSubscriptionPlan(
      newVariantId,
    );
  }

  /**
   *
   * @param subscriptionSlug
   * @returns
   */
  public markSubscriptionPaymentFailed(subscriptionSlug: string = 'main') {
    return this.markSubscriptionPaymentFailedService.execute(subscriptionSlug);
  }

  /**
   *
   * @param subscriptionSlug
   * @returns
   */
  public markSubscriptionPaymentSuccessed(subscriptionSlug: string = 'main') {
    return this.markSubscriptionPaymentSuccessedService.execute(
      subscriptionSlug,
    );
  }

  /**
   * Marks the given subscription slug canceled.
   * @param {string} subscriptionSlug
   * @returns
   */
  public markSubscriptionCanceled(subscriptionSlug: string = 'main') {
    return this.markSubscriptionCanceledService.execute(subscriptionSlug);
  }

  /**
   *
   * @param {string} newPlanSlug
   * @param {string} subscriptionSlug
   * @returns
   */
  public markSubscriptionPlanChanged(
    newPlanSlug: string,
    subscriptionSlug: string = 'main',
  ) {
    return this.markSubscriptionPlanChangedService.execute(
      newPlanSlug,
      subscriptionSlug,
    );
  }

  /**
   * Marks the given subscription slug resumed.
   * @param {string} subscriptionSlug
   * @returns
   */
  markSubscriptionResumed(subscriptionSlug: string = 'main') {
    return this.markSubscriptionResumedService.execute(subscriptionSlug);
  }
}
