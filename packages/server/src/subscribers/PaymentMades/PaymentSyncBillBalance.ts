import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { BillPaymentBillSync } from '@/services/Purchases/BillPayments/BillPaymentBillSync';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventDeletedPayload,
  IBillPaymentEventEditedPayload,
} from '@/interfaces';

@Service()
export default class PaymentSyncBillBalance {
  @Inject()
  private billPaymentsService: BillPaymentBillSync;

  /**
   *
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.billPayment.onCreated,
      this.handleBillsIncrementPaymentAmount
    );
    bus.subscribe(
      events.billPayment.onEdited,
      this.handleBillsIncrementPaymentAmount
    );
    bus.subscribe(
      events.billPayment.onDeleted,
      this.handleBillDecrementPaymentAmount
    );
  }

  /**
   * Handle bill payment amount increment/decrement once bill payment created or edited.
   */
  private handleBillsIncrementPaymentAmount = async ({
    tenantId,
    billPayment,
    oldBillPayment,
    billPaymentId,
    trx,
  }: IBillPaymentEventCreatedPayload | IBillPaymentEventEditedPayload) => {
    this.billPaymentsService.saveChangeBillsPaymentAmount(
      tenantId,
      billPayment.entries,
      oldBillPayment?.entries || null,
      trx
    );
  };

  /**
   * Handle revert bill payment amount once bill payment deleted.
   */
  private handleBillDecrementPaymentAmount = async ({
    tenantId,
    billPaymentId,
    oldBillPayment,
    trx,
  }: IBillPaymentEventDeletedPayload) => {
    this.billPaymentsService.saveChangeBillsPaymentAmount(
      tenantId,
      oldBillPayment.entries.map((entry) => ({ ...entry, paymentAmount: 0 })),
      oldBillPayment.entries,
      trx
    );
  };
}
