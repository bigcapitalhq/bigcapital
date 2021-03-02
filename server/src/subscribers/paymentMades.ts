import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import BillPaymentsService from 'services/Purchases/BillPayments';
import TenancyService from 'services/Tenancy/TenancyService';

@EventSubscriber()
export default class PaymentMadesSubscriber {
  tenancy: TenancyService;
  billPaymentsService: BillPaymentsService;
  logger: any;

  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.billPaymentsService = Container.get(BillPaymentsService);
    this.logger = Container.get('logger');
  }

  /**
   * Handle bill payment amount increment/decrement once bill payment created or edited.
   */
  @On(events.billPayment.onCreated)
  @On(events.billPayment.onEdited)
  async handleBillsIncrementPaymentAmount({
    tenantId,
    billPayment,
    oldBillPayment,
    billPaymentId,
  }) {
    this.logger.info('[payment_made] trying to change bills payment amount.', {
      tenantId,
      billPaymentId,
    });
    this.billPaymentsService.saveChangeBillsPaymentAmount(
      tenantId,
      billPayment.entries,
      oldBillPayment?.entries || null
    );
  }

  /**
   * Handle revert bill payment amount once bill payment deleted.
   */
  @On(events.billPayment.onDeleted)
  handleBillDecrementPaymentAmount({
    tenantId,
    billPaymentId,
    oldBillPayment,
  }) {
    this.logger.info('[payment_made] tring to revert bill payment amount.', {
      tenantId,
      billPaymentId,
    });
    this.billPaymentsService.saveChangeBillsPaymentAmount(
      tenantId,
      oldBillPayment.entries.map((entry) => ({ ...entry, paymentAmount: 0 })),
      oldBillPayment.entries
    );
  }

  /**
   * Handle bill payment writing journal entries once created.
   */
  @On(events.billPayment.onCreated)
  async handleWriteJournalEntries({ tenantId, billPayment }) {
    // Records the journal transactions after bills payment
    // and change diff acoount balance.
    this.logger.info('[bill_payment] trying to write journal entries.', {
      tenantId,
      billPaymentId: billPayment.id,
    });
    await this.billPaymentsService.recordJournalEntries(tenantId, billPayment);
  }

  /**
   * Handle bill payment re-writing journal entries once the payment transaction be edited.
   */
  @On(events.billPayment.onEdited)
  async handleRewriteJournalEntriesOncePaymentEdited({
    tenantId,
    billPayment,
  }) {
    // Records the journal transactions after bills payment be edited.
    this.logger.info('[bill_payment] trying to rewrite journal entries.', {
      tenantId,
      billPaymentId: billPayment.id,
    });
    await this.billPaymentsService.recordJournalEntries(
      tenantId,
      billPayment,
      true
    );
  }

  /**
   * Reverts journal entries once bill payment deleted.
   */
  @On(events.billPayment.onDeleted)
  async handleRevertJournalEntries({ tenantId, billPaymentId }) {
    await this.billPaymentsService.revertJournalEntries(
      tenantId,
      billPaymentId
    );
  }
}
