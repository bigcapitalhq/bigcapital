import { Module } from '@nestjs/common';
import { SocketModule } from '../Socket/Socket.module';
import { CancelLemonSubscription } from './commands/CancelLemonSubscription.service';
import { ChangeLemonSubscription } from './commands/ChangeLemonSubscription.service';
import { ResumeLemonSubscription } from './commands/ResumeLemonSubscription.service';
import { LemonSqueezyWebhooks } from './webhooks/LemonSqueezyWebhooks';
import { SubscribeFreeOnSignupCommunity } from './subscribers/SubscribeFreeOnSignupCommunity';
import { TriggerInvalidateCacheOnSubscriptionChange } from './subscribers/TriggerInvalidateCacheOnSubscriptionChange';
import { SubscriptionsController } from './Subscriptions.controller';
import { SubscriptionsLemonWebhook } from './SubscriptionsLemonWebhook.controller';
import { MarkSubscriptionPaymentFailed } from './commands/MarkSubscriptionPaymentFailed.service';
import { MarkSubscriptionPaymentSucceed } from './commands/MarkSubscriptionPaymentSuccessed.service';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { PlanSubscription } from './models/PlanSubscription';
import { MarkSubscriptionCanceled } from './commands/MarkSubscriptionCanceled.service';
import { MarkSubscriptionPlanChanged } from './commands/MarkSubscriptionChanged.service';
import { MarkSubscriptionResumedService } from './commands/MarkSubscriptionResumed.sevice';
import { Plan } from './models/Plan';
import { SubscriptionApplication } from './SubscriptionApplication';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { NewSubscriptionService } from './commands/NewSubscription.service';
import { GetSubscriptionsService } from './queries/GetSubscriptions.service';
import { GetLemonSqueezyCheckoutService } from './queries/GetLemonSqueezyCheckout.service';
import { PlanSubscriptionRepository } from './repositories/PlanSubscription.repository';

const models = [InjectSystemModel(Plan), InjectSystemModel(PlanSubscription)];

@Module({
  imports: [SocketModule],
  providers: [
    ...models,
    TenancyContext,
    PlanSubscriptionRepository,
    NewSubscriptionService,
    GetSubscriptionsService,
    CancelLemonSubscription,
    ChangeLemonSubscription,
    ResumeLemonSubscription,
    LemonSqueezyWebhooks,
    SubscribeFreeOnSignupCommunity,
    TriggerInvalidateCacheOnSubscriptionChange,
    MarkSubscriptionPaymentFailed,
    MarkSubscriptionPaymentSucceed,
    MarkSubscriptionCanceled,
    MarkSubscriptionPlanChanged,
    MarkSubscriptionResumedService,
    SubscriptionApplication,
    GetLemonSqueezyCheckoutService,
  ],
  controllers: [SubscriptionsController, SubscriptionsLemonWebhook],
  exports: [...models],
})
export class SubscriptionModule { }
