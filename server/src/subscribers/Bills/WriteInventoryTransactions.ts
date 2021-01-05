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
   * Handles writing the inventory transactions once bill created.
   */
  @On(events.bill.onCreated)
  async handleWritingInventoryTransactions({ tenantId, bill }) {
    this.logger.info('[bill] writing the inventory transactions', { tenantId });
    this.billsService.recordInventoryTransactions(
      tenantId,
      bill
    );
  }
 
  /**
   * Handles the overwriting the inventory transactions once bill edited.
   */
  @On(events.bill.onEdited)
  async handleOverwritingInventoryTransactions({ tenantId, bill }) {
    this.logger.info('[bill] overwriting the inventory transactions.', {
      tenantId,
    });
    this.billsService.recordInventoryTransactions(
      tenantId,
      bill,
      true
    );
  }

  /**
   * Handles the reverting the inventory transactions once the bill deleted.
   */
  @On(events.bill.onDeleted)
  async handleRevertInventoryTransactions({ tenantId, billId }) {
    this.logger.info('[bill] reverting the bill inventory transactions', {
      tenantId,
      billId,
    });
    this.billsService.revertInventoryTransactions(tenantId, billId);
  }
}
