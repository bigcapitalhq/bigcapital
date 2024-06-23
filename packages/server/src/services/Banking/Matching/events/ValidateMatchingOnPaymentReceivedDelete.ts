import { Inject, Service } from 'typedi';
import { IPaymentReceiveDeletedPayload } from '@/interfaces';
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
      this.validateMatchingOnPaymentReceivedDelete.bind(this)
    );
  }

  /**
   *
   * @param {IPaymentReceiveDeletedPayload}
   */
  public async validateMatchingOnPaymentReceivedDelete({
    tenantId,
    oldPaymentReceive,
    trx,
  }: IPaymentReceiveDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'PaymentReceive',
      oldPaymentReceive.id
    );
  }
}
