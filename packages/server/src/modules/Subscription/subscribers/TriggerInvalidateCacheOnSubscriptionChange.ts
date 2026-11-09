import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketGateway } from '../../Socket/Socket.gateway';

@Injectable()
export class TriggerInvalidateCacheOnSubscriptionChange {
  constructor(private readonly socketGateway: SocketGateway) {}

  @OnEvent(events.subscription.onSubscriptionCancelled)
  @OnEvent(events.subscription.onSubscriptionResumed)
  @OnEvent(events.subscription.onSubscriptionPlanChanged)
  @OnEvent(events.subscription.onSubscriptionSubscribed)
  @OnEvent(events.subscription.onSubscriptionPaymentSucceed)
  @OnEvent(events.subscription.onSubscriptionPaymentFailed)
  triggerInvalidateCache() {
    // Notify the frontend to reflect the subscription changes.
    this.socketGateway.emitSubscriptionChanged();
  }
}
