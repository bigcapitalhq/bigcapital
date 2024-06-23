import { Inject, Service } from 'typedi';
import {
  IBillPaymentEventDeletedPayload,
  IPaymentReceiveDeletedPayload,
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
      this.validateMatchingOnPaymentMadeDelete.bind(this)
    );
  }

  /**
   *
   * @param {IPaymentReceiveDeletedPayload}
   */
  public async validateMatchingOnPaymentMadeDelete({
    tenantId,
    oldBillPayment,
    trx,
  }: IBillPaymentEventDeletedPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'PaymentMade',
      oldBillPayment.id
    );
  }
}
