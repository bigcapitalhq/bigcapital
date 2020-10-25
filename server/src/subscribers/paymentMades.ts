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
   * Handles bills payment amount increment once payment made created.
   */
  @On(events.billPayments.onCreated)
  async handleBillsIncrementPaymentAmount({ tenantId, billPayment, billPaymentId }) {
    const { Bill } = this.tenancy.models(tenantId);
    const storeOpers = [];

    billPayment.entries.forEach((entry) => {
      this.logger.info('[bill_payment] increment bill payment amount.', {
        tenantId, billPaymentId,
        billId: entry.billId, 
        amount: entry.paymentAmount,
      })
      // Increment the bill payment amount.
      const billOper = Bill.changePaymentAmount(
        entry.billId,
        entry.paymentAmount,
      );
      storeOpers.push(billOper);
    });
    await Promise.all(storeOpers);
  }

  /**
   * Handle vendor balance increment once payment made created.
   */
  @On(events.billPayments.onCreated)
  async handleVendorIncrement({ tenantId, billPayment, billPaymentId }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Increment the vendor balance after bills payments.
    this.logger.info('[bill_payment] trying to increment vendor balance.', { tenantId });
    await vendorRepository.changeBalance(
      billPayment.vendorId,
      billPayment.amount * -1,
    );
  }

  /**
   * Handle bill payment writing journal entries once created. 
   */
  @On(events.billPayments.onCreated)
  async handleWriteJournalEntries({ tenantId, billPayment }) {
    // Records the journal transactions after bills payment
    // and change diff acoount balance.
    this.logger.info('[bill_payment] trying to write journal entries.', { tenantId, billPaymentId: billPayment.id });
    await this.billPaymentsService.recordJournalEntries(tenantId, billPayment);
  }

  /**
   * Decrements the vendor balance once bill payment deleted. 
   */
  @On(events.billPayments.onDeleted)
  async handleVendorDecrement({ tenantId, paymentMadeId, oldPaymentMade }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    await vendorRepository.changeBalance(
      oldPaymentMade.vendorId,
      oldPaymentMade.amount,
    );
  }

  /**
   * Reverts journal entries once bill payment deleted.
   */
  @On(events.billPayments.onDeleted)
  async handleRevertJournalEntries({ tenantId, billPaymentId }) {
    await this.billPaymentsService.revertJournalEntries(
      tenantId, billPaymentId,
    );
  }

  /**
   * Change the vendor balance different between old and new once
   * bill payment edited.
   */
  @On(events.billPayments.onEdited)
  async handleVendorChangeDiffBalance({ tenantId, paymentMadeId, billPayment, oldBillPayment }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Change the different vendor balance between the new and old one.
    await vendorRepository.changeDiffBalance(
      billPayment.vendor_id,
      oldBillPayment.vendorId,
      billPayment.amount * -1,
      oldBillPayment.amount * -1,
    );
  }
}