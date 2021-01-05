import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import BillsService from 'services/Purchases/Bills';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  billsService: BillsService;
  logger: any;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.billsService = Container.get(BillsService);
    this.logger = Container.get('logger');
  }

  /**
   * Handles writing journal entries once bill created.
   */
  @On(events.bill.onCreated)
  async handlerWriteJournalEntriesOnCreate({ tenantId, bill }) {
    // Writes the journal entries for the given bill transaction.
    this.logger.info('[bill] writing bill journal entries.', { tenantId });
    await this.billsService.recordJournalTransactions(tenantId, bill);
  }

  /**
   * Handles the overwriting journal entries once bill edited.
   */
  @On(events.bill.onEdited)
  async handleOverwriteJournalEntriesOnEdit({ tenantId, bill }) {
    // Overwrite the journal entries for the given bill transaction.
    this.logger.info('[bill] overwriting bill journal entries.', { tenantId });
    await this.billsService.recordJournalTransactions(tenantId, bill, true);
  }

  /**
   * Handles revert journal entries on bill deleted.
   */
  @On(events.bill.onDeleted)
  async handlerDeleteJournalEntries({ tenantId, billId }) {
    // Delete associated bill journal transactions.
    this.logger.info('[bill] trying to delete journal entries.', {
      tenantId,
      billId,
    });
    await this.billsService.revertJournalEntries(tenantId, billId);
  }
}
