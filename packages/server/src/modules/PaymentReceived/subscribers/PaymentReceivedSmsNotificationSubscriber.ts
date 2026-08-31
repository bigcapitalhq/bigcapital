import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { PaymentReceivedSmsNotification } from '../PaymentReceivedSmsNotification';
import { IPaymentReceivedCreatedPayload } from '../types/PaymentReceived.types';

@Injectable()
export class PaymentReceivedSmsNotificationSubscriber {
  constructor(
    private readonly paymentReceivedSmsNotification: PaymentReceivedSmsNotification,
  ) {}

  /**
   * Handles sending SMS notification after the payment received creation.
   * @param {IPaymentReceivedCreatedPayload} payload -
   */
  @OnEvent(events.paymentReceive.onCreated)
  private async handleNotifyBySmsAfterCreation({
    paymentReceiveId,
    trx,
  }: IPaymentReceivedCreatedPayload) {
    runAfterTransaction(trx, async () => {
      try {
        await this.paymentReceivedSmsNotification.notifyDetailsBySmsAfterCreation(
          paymentReceiveId,
        );
      } catch (error) {}
    });
  }
}
