import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import BillsService from 'services/Purchases/Bills';
import JournalPosterService from 'services/Sales/JournalPosterService';
import VendorRepository from 'repositories/VendorRepository';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  billsService: BillsService;
  logger: any;
  journalPosterService: JournalPosterService;

  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.billsService = Container.get(BillsService);
    this.logger = Container.get('logger');

    this.journalPosterService = Container.get(JournalPosterService);
  }

  /**
   * Handles vendor balance increment once bill created.
   */
  @On(events.bills.onCreated)
  async handleVendorBalanceIncrement({ tenantId, billId, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Increments vendor balance.
    this.logger.info('[bill] trying to increment vendor balance.', { tenantId, billId });
    await vendorRepository.changeBalance(bill.vendorId, bill.amount);
  }

  /**
   * Handles writing journal entries once bill created.
   */
  @On(events.bills.onCreated)
  @On(events.bills.onEdited)
  async handlerWriteJournalEntries({ tenantId, billId, bill }) {
    // Writes the journal entries for the given bill transaction.
    this.logger.info('[bill] writing bill journal entries.', { tenantId });
    await this.billsService.recordJournalTransactions(tenantId, bill);
  }

  /**
   * Handles vendor balance decrement once bill deleted.
   */
  @On(events.bills.onDeleted)
  async handleVendorBalanceDecrement({ tenantId, billId, oldBill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Decrements vendor balance.
    this.logger.info('[bill] trying to decrement vendor balance.', { tenantId, billId });
    await vendorRepository.changeBalance(oldBill.vendorId, oldBill.amount * -1);
  }

  /**
   * Handles revert journal entries on bill deleted.
   */
  @On(events.bills.onDeleted)
  async handlerDeleteJournalEntries({ tenantId, billId }) {
    // Delete associated bill journal transactions.
    this.logger.info('[bill] trying to delete journal entries.', { tenantId, billId });
    await this.journalPosterService.revertJournalTransactions(tenantId, billId, 'Bill');
  }


  @On(events.bills.onEdited)
  async handleCustomerBalanceDiffChange({ tenantId, billId, oldBill, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Changes the diff vendor balance between old and new amount.
    this.logger.info('[bill[ change vendor the different balance.', { tenantId, billId });
    await vendorRepository.changeDiffBalance(
      bill.vendorId,
      oldBill.vendorId,
      bill.amount,
      oldBill.amount,
    );
  }
}