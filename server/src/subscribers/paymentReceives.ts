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
   * Handle customer balance decrement once payment receive created.
   */
  @On(events.paymentReceive.onCreated)
  async handleCustomerBalanceDecrement({ tenantId, paymentReceiveId, paymentReceive }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[payment_receive] trying to decrement customer balance.');
    await customerRepository.changeBalance(paymentReceive.customerId, paymentReceive.amount * -1);
  }

  /**
   * Handle sale invoice increment/decrement payment amount once created, edited or deleted.
   */
  @On(events.paymentReceive.onCreated)
  @On(events.paymentReceive.onEdited)
  async handleInvoiceIncrementPaymentAmount({ tenantId, paymentReceiveId, paymentReceive, oldPaymentReceive }) {

    this.logger.info('[payment_receive] trying to change sale invoice payment amount.', { tenantId });
    await this.paymentReceivesService.saveChangeInvoicePaymentAmount(
      tenantId,
      paymentReceive.entries,
      oldPaymentReceive?.entries || null,
    );
  }

  /**
   * Handle revert invoices payment amount once payment receive deleted.
   */
  @On(events.paymentReceive.onDeleted)
  async handleInvoiceDecrementPaymentAmount({ tenantId, paymentReceiveId, oldPaymentReceive }) {
    this.logger.info('[payment_receive] trying to decrement sale invoice payment amount.');

    await this.paymentReceivesService.saveChangeInvoicePaymentAmount(
      tenantId,
      oldPaymentReceive.entries.map((entry) => ({ ...entry, paymentAmount: 0 })),
      oldPaymentReceive.entries,
    );
  }

  /**
   * Handle customer balance increment once payment receive deleted.
   */
  @On(events.paymentReceive.onDeleted)
  async handleCustomerBalanceIncrement({ tenantId, paymentReceiveId, oldPaymentReceive }) { 
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[payment_receive] trying to increment customer balance.');
    await customerRepository.changeBalance(
      oldPaymentReceive.customerId,
      oldPaymentReceive.amount,
    );
  }

  /**
   * Handles customer balance diff balance change once payment receive edited.
   */
  @On(events.paymentReceive.onEdited)
  async handleCustomerBalanceDiffChange({ tenantId, paymentReceiveId, paymentReceive, oldPaymentReceive }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    await customerRepository.changeDiffBalance(
      paymentReceive.customerId,
      paymentReceive.amount * -1,
      oldPaymentReceive.amount * -1,
      oldPaymentReceive.customerId,
    );
  }

  /**
   * Handles increment next number of payment receive once be created.
   */
  @On(events.paymentReceive.onCreated)
  public async handlePaymentNextNumberIncrement({ tenantId, paymentReceiveId }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'payment_receives',
    });
  }
}