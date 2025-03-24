import { Module } from '@nestjs/common';
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
import { Plan } from './models/Plan';


const models = [InjectSystemModel(Plan), InjectSystemModel(PlanSubscription)]

@Module({
  providers: [
    ...models,
    CancelLemonSubscription,
    ChangeLemonSubscription,
    ResumeLemonSubscription,
    LemonSqueezyWebhooks,
    SubscribeFreeOnSignupCommunity,
    TriggerInvalidateCacheOnSubscriptionChange,
    MarkSubscriptionPaymentFailed,
    MarkSubscriptionPaymentSucceed
  ],
  controllers: [SubscriptionsController, SubscriptionsLemonWebhook],
  exports: [...models]
})
export class SubscriptionModule {}
