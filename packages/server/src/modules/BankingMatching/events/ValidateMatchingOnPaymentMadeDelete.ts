import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { IBillPaymentEventDeletedPayload } from '@/modules/BillPayments/types/BillPayments.types';
import { events } from '@/common/events/events';

@Injectable()
export class ValidateMatchingOnPaymentMadeDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the payment made transaction whether matched with bank transaction on deleting.
   * @param {IPaymentReceivedDeletedPayload}
   */
  @OnEvent(events.billPayment.onDeleting)
  public async validateMatchingOnPaymentMadeDeleting({
    oldBillPayment,
    trx,
  }: IBillPaymentEventDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'PaymentMade',
      oldBillPayment.id,
      trx,
    );
  }
}
