import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import PaymentReceiveService from 'services/Sales/PaymentsReceives';
import SettingsService from 'services/Settings/SettingsService';

@EventSubscriber()
export default class PaymentReceivesSubscriber {
  tenancy: TenancyService;
  logger: any;
  paymentReceivesService: PaymentReceiveService;
  settingsService: SettingsService;

  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.logger = Container.get('logger');
    this.paymentReceivesService = Container.get(PaymentReceiveService);
    this.settingsService = Container.get(SettingsService);
  }

  /**
   * Handle journal entries writing once the payment receive created.
   */
  @On(events.paymentReceive.onCreated)
  async handleWriteJournalEntriesOnceCreated({
    tenantId,
    paymentReceiveId,
    paymentReceive,
    authorizedUser,
  }) {
    this.logger.info('[payment_receive] trying to write journal entries.', {
      tenantId, paymentReceiveId,
    });
    await this.paymentReceivesService.recordPaymentReceiveJournalEntries(
      tenantId,
      paymentReceive,
      authorizedUser.id,
    );
  }

  /**
   * Handle journal entries writing once the payment receive edited.
   */
  @On(events.paymentReceive.onEdited)
  async handleOverwriteJournalEntriesOnceEdited({
    tenantId,
    paymentReceiveId,
    paymentReceive,
    authorizedUser,
  }) {
    this.logger.info('[payment_receive] trying to overwrite journal entries.', {
      tenantId, paymentReceiveId,
    });
    await this.paymentReceivesService.recordPaymentReceiveJournalEntries(
      tenantId,
      paymentReceive,
      authorizedUser.id,
      true
    );
  }

  /**
   * Handle sale invoice increment/decrement payment amount once created, edited or deleted.
   */
  @On(events.paymentReceive.onCreated)
  @On(events.paymentReceive.onEdited)
  async handleInvoiceIncrementPaymentAmount({
    tenantId,
    paymentReceiveId,
    paymentReceive,
    oldPaymentReceive,
  }) {
    this.logger.info(
      '[payment_receive] trying to change sale invoice payment amount.',
      { tenantId }
    );
    await this.paymentReceivesService.saveChangeInvoicePaymentAmount(
      tenantId,
      paymentReceive.entries,
      oldPaymentReceive?.entries || null
    );
  }

  /**
   * Handle revert invoices payment amount once payment receive deleted.
   */
  @On(events.paymentReceive.onDeleted)
  async handleInvoiceDecrementPaymentAmount({
    tenantId,
    paymentReceiveId,
    oldPaymentReceive,
  }) {
    this.logger.info(
      '[payment_receive] trying to decrement sale invoice payment amount.'
    );
    await this.paymentReceivesService.saveChangeInvoicePaymentAmount(
      tenantId,
      oldPaymentReceive.entries.map((entry) => ({
        ...entry,
        paymentAmount: 0,
      })),
      oldPaymentReceive.entries
    );
  }

  /**
   * Handles revert journal entries once deleted.
   */
  @On(events.paymentReceive.onDeleted)
  async handleRevertJournalEntriesOnceDeleted({
    tenantId,
    paymentReceiveId,
  }) {
    this.logger.info('[payment_receive] trying to revert journal entries.', {
      tenantId,
      paymentReceiveId,
    });
    await this.paymentReceivesService.revertPaymentReceiveJournalEntries(
      tenantId,
      paymentReceiveId
    )
  }

  /**
   * Handles increment next number of payment receive once be created.
   */
  @On(events.paymentReceive.onCreated)
  public async handlePaymentNextNumberIncrement({
    tenantId,
    paymentReceiveId,
  }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'payment_receives',
    });
  }
}
