import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { PaymentReceivedIncrement } from '../commands/PaymentReceivedIncrement.service';
import { IPaymentReceivedCreatedPayload } from '../types/PaymentReceived.types';

@Injectable()
export class PaymentReceivedAutoIncrementSubscriber {
  constructor(private readonly paymentIncrement: PaymentReceivedIncrement) {}

  /**
   * Handles increment next number of payment receive once be created.
   * @param {IPaymentReceivedCreatedPayload} payload -
   */
  @OnEvent(events.paymentReceive.onCreated)
  private async handlePaymentNextNumberIncrement({}: IPaymentReceivedCreatedPayload) {
    await this.paymentIncrement.incrementNextPaymentReceiveNumber();
  }
}
