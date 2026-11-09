import { Module } from '@nestjs/common';
import { SocketModule } from '../Socket/Socket.module';
import { SubscribeFreeOnSignupCommunity } from './subscribers/SubscribeFreeOnSignupCommunity';
import { TriggerInvalidateCacheOnSubscriptionChange } from './subscribers/TriggerInvalidateCacheOnSubscriptionChange';
import { SubscriptionsController } from './Subscriptions.controller';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { PlanSubscription } from './models/PlanSubscription';
import { Plan } from './models/Plan';
import { StripeWebhookEvent } from './models/StripeWebhookEvent';
import { SubscriptionApplication } from './SubscriptionApplication';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { NewSubscriptionService } from './commands/NewSubscription.service';
import { GetSubscriptionsService } from './queries/GetSubscriptions.service';
import { PlanSubscriptionRepository } from './repositories/PlanSubscription.repository';
import { GetPlansService } from './stripe/GetPlans.service';
import { GetBillingOverviewService } from './stripe/GetBillingOverview.service';
import { StripeBillingService } from './stripe/StripeBillingService';
import { StripePlanSyncService } from './stripe/StripePlanSyncService';
import { CreateStripeCheckoutSessionService } from './stripe/CreateStripeCheckoutSession.service';
import { CreateStripePortalSessionService } from './stripe/CreateStripePortalSession.service';
import { SyncStripeCheckoutSessionService } from './stripe/SyncStripeCheckoutSession.service';
import { ChangeStripeSubscriptionService } from './stripe/ChangeStripeSubscription.service';
import { CancelStripeSubscriptionService } from './stripe/CancelStripeSubscription.service';
import { ResumeStripeSubscriptionService } from './stripe/ResumeStripeSubscription.service';
import { SyncStripeSubscriptionService } from './stripe/SyncStripeSubscription.service';
import { StripeBillingWebhooksService } from './stripe/StripeBillingWebhooks.service';
import { StripeBillingWebhooksController } from './stripe/StripeBillingWebhooks.controller';
import { SubscriptionLimitsService } from './limits/SubscriptionLimits.service';

const models = [
  InjectSystemModel(Plan),
  InjectSystemModel(PlanSubscription),
  InjectSystemModel(StripeWebhookEvent),
];

@Module({
  imports: [TenancyModule, SocketModule],
  providers: [
    ...models,
    PlanSubscriptionRepository,
    NewSubscriptionService,
    GetSubscriptionsService,
    GetPlansService,
    GetBillingOverviewService,
    StripeBillingService,
    StripePlanSyncService,
    CreateStripeCheckoutSessionService,
    CreateStripePortalSessionService,
    SyncStripeCheckoutSessionService,
    ChangeStripeSubscriptionService,
    CancelStripeSubscriptionService,
    ResumeStripeSubscriptionService,
    SyncStripeSubscriptionService,
    StripeBillingWebhooksService,
    SubscribeFreeOnSignupCommunity,
    TriggerInvalidateCacheOnSubscriptionChange,
    SubscriptionApplication,
    SubscriptionLimitsService,
  ],
  controllers: [SubscriptionsController, StripeBillingWebhooksController],
  exports: [...models, SubscriptionLimitsService],
})
export class SubscriptionModule {}
