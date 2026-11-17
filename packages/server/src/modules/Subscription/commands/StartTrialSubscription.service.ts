import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { PlanSubscriptionRepository } from '../repositories/PlanSubscription.repository';

const DEFAULT_TRIAL_DAYS = 15;
const TRIAL_PLAN_SLUG = 'go-monthly';
const FALLBACK_PLAN_SLUG = 'free';

@Injectable()
export class StartTrialSubscriptionService {
  private readonly logger = new Logger(StartTrialSubscriptionService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly subscriptionRepository: PlanSubscriptionRepository,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Starts a local full-access trial for the given Cloud tenant.
   * The operation is idempotent: an existing main subscription is left intact.
   */
  public async execute(tenantId: number): Promise<void> {
    if (this.configService.get<boolean>('cloud.hostedOnCloud') !== true) {
      return;
    }

    const existingSubscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId, slug: 'main' });

    if (existingSubscription) {
      return;
    }

    const plan =
      (await this.planModel
        .query()
        .findOne({ slug: TRIAL_PLAN_SLUG, active: true })) ??
      (await this.planModel.query().findOne({ slug: FALLBACK_PLAN_SLUG }));

    if (!plan) {
      this.logger.error(
        `Unable to start a trial for tenant ${tenantId}: no trial plan exists.`,
      );
      return;
    }

    const configuredDays = this.configService.get<number>(
      'cloud.freeTrialDays',
    );
    const trialDays =
      Number.isFinite(configuredDays) && configuredDays > 0
        ? configuredDays
        : DEFAULT_TRIAL_DAYS;

    const startsAt = new Date();
    const trialEndsAt = new Date(
      startsAt.getTime() + trialDays * 24 * 60 * 60 * 1000,
    );

    await this.subscriptionRepository.newSubscription(
      tenantId,
      plan.id,
      'month',
      1,
      'main',
      { trialEndsAt, endsAt: trialEndsAt },
    );
  }
}
