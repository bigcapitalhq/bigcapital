import { Inject, Service } from 'typedi';
import {
  IBillPaymentEventDeletedPayload,
  IPaymentReceivedDeletedPayload,
} from '@/interfaces';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';
import events from '@/subscribers/events';

@Service()
export class ValidateMatchingOnPaymentMadeDelete {
  @Inject()
  private validateNoMatchingLinkedService: ValidateTransactionMatched;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.billPayment.onDeleting,
      this.validateMatchingOnPaymentMadeDeleting.bind(this)
    );
  }

  /**
   * Validates the payment made transaction whether matched with bank transaction on deleting.
   * @param {IPaymentReceivedDeletedPayload}
   */
  public async validateMatchingOnPaymentMadeDeleting({
    tenantId,
    oldBillPayment,
    trx,
  }: IBillPaymentEventDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'PaymentMade',
      oldBillPayment.id,
      trx
    );
  }
}
