import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { map, head } from 'lodash';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import BillsService from 'services/Purchases/Bills';
import JournalPosterService from 'services/Sales/JournalPosterService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  billsService: BillsService;
  logger: any;
  journalPosterService: JournalPosterService;
  itemsEntriesService: ItemsEntriesService;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.billsService = Container.get(BillsService);
    this.logger = Container.get('logger');
    this.journalPosterService = Container.get(JournalPosterService);
    this.itemsEntriesService = Container.get(ItemsEntriesService);
  }

  /**
   * Handles vendor balance increment once bill created.
   */
  @On(events.bill.onCreated)
  async handleVendorBalanceIncrement({ tenantId, billId, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Increments vendor balance.
    this.logger.info('[bill] trying to increment vendor balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeBalance(bill.vendorId, bill.amount);
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
   * Handles vendor balance decrement once bill deleted.
   */
  @On(events.bill.onDeleted)
  async handleVendorBalanceDecrement({ tenantId, billId, oldBill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Decrements vendor balance.
    this.logger.info('[bill] trying to decrement vendor balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeBalance(oldBill.vendorId, oldBill.amount * -1);
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
    await this.journalPosterService.revertJournalTransactions(
      tenantId,
      billId,
      'Bill'
    );
  }

  /**
   * Handles vendor balance difference change.
   */
  @On(events.bill.onEdited)
  async handleVendorBalanceDiffChange({ tenantId, billId, oldBill, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Changes the diff vendor balance between old and new amount.
    this.logger.info('[bill[ change vendor the different balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeDiffBalance(
      bill.vendorId,
      bill.amount,
      oldBill.amount,
      oldBill.vendorId
    );
  }

  /**
   * Handles writing the inventory transactions once bill created.
   */
  @On(events.bill.onCreated)
  async handleWritingInventoryTransactions({ tenantId, bill }) {
    this.logger.info('[bill] writing the inventory transactions', { tenantId });
    this.billsService.recordInventoryTransactions(
      tenantId,
      bill.id,
      bill.billDate
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
      bill.id,
      bill.billDate,
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

  /**
   * Schedules items cost compute jobs once the inventory transactions created
   * of the bill transaction.
   */
  @On(events.bill.onInventoryTransactionsCreated)
  public async handleComputeItemsCosts({ tenantId, billId }) {
    this.logger.info('[bill] trying to compute the bill items cost.', {
      tenantId,
      billId,
    });
    await this.billsService.scheduleComputeCostByBillId(tenantId, billId);
  }

  /**
   * Handles computes items costs once the inventory transactions deleted.
   */
  @On(events.bill.onInventoryTransactionsDeleted)
  public async handleComputeCostsOnInventoryTransactionsDeleted({
    tenantId,
    billId,
    oldInventoryTransactions,
  }) {
    const inventoryItemsIds = map(oldInventoryTransactions, 'itemId');
    const startingDates = map(oldInventoryTransactions, 'date');
    const startingDate = head(startingDates);

    await this.billsService.scheduleComputeCostByItemsIds(
      tenantId,
      inventoryItemsIds,
      startingDate
    );
  }

  /**
   * Increments the sale invoice items once the invoice created.
   */
  @On(events.bill.onCreated)
  public async handleDecrementSaleInvoiceItemsQuantity({ tenantId, bill }) {
    await this.itemsEntriesService.incrementItemsEntries(
      tenantId,
      bill.entries
    );
  }

  /**
   * Decrements the sale invoice items once the invoice deleted.
   */
  @On(events.bill.onDeleted)
  public async handleIncrementSaleInvoiceItemsQuantity({ tenantId, oldBill }) {
    await this.itemsEntriesService.decrementItemsQuantity(
      tenantId,
      oldBill.entries
    );
  }

  /**
   * Handle increment/decrement the different items quantity once the sale invoice be edited.
   */
  @On(events.bill.onEdited)
  public async handleChangeSaleInvoiceItemsQuantityOnEdit({
    tenantId,
    bill,
    oldBill,
  }) {
    await this.itemsEntriesService.changeItemsQuantity(
      tenantId,
      bill.entries,
      oldBill.entries
    );
  }
}
