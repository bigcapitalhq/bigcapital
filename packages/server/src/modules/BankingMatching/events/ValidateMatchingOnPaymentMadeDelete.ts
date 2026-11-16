import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { IBillPaymentDeletingPayload } from '@/modules/BillPayments/types/BillPayments.types';
import { events } from '@/common/events/events';

@Injectable()
export class ValidateMatchingOnPaymentMadeDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the payment made transaction whether matched with bank transaction on deleting.
   * @param {IBillPaymentDeletingPayload}
   */
  @OnEvent(events.billPayment.onDeleting, { suppressErrors: false })
  public async validateMatchingOnPaymentMadeDeleting({
    oldBillPayment,
    trx,
  }: IBillPaymentDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'BillPayment',
      oldBillPayment.id,
      trx,
    );
  }
}
