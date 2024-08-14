import { Inject, Service } from 'typedi';
import { IPaymentReceivedDeletedPayload } from '@/interfaces';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';
import events from '@/subscribers/events';

@Service()
export class ValidateMatchingOnPaymentReceivedDelete {
  @Inject()
  private validateNoMatchingLinkedService: ValidateTransactionMatched;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onDeleting,
      this.validateMatchingOnPaymentReceivedDeleting.bind(this)
    );
  }

  /**
   * Validates the payment received transaction whether matched with bank transaction on deleting.
   * @param {IPaymentReceivedDeletedPayload}
   */
  public async validateMatchingOnPaymentReceivedDeleting({
    tenantId,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx
    );
  }
}
