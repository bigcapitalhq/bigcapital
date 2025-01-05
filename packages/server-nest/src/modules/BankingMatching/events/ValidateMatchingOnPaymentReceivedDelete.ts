import { Injectable } from '@nestjs/common';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IPaymentReceivedDeletedPayload } from '@/modules/PaymentReceived/types/PaymentReceived.types';

@Injectable()
export class ValidateMatchingOnPaymentReceivedDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the payment received transaction whether matched with bank transaction on deleting.
   * @param {IPaymentReceivedDeletedPayload}
   */
  @OnEvent(events.paymentReceive.onDeleting)
  public async validateMatchingOnPaymentReceivedDeleting({
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'PaymentReceive',
      oldPaymentReceive.id,
      trx,
    );
  }
}
