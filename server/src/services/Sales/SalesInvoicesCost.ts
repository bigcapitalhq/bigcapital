import { Container, Service, Inject } from 'typedi';
import { chain, groupBy } from 'lodash';
import moment from 'moment';
import JournalPoster from 'services/Accounting/JournalPoster';
import InventoryService from 'services/Inventory/Inventory';
import TenancyService from 'services/Tenancy/TenancyService';
import { IInventoryLotCost, IInventoryTransaction, IItem } from 'interfaces';
import JournalCommands from 'services/Accounting/JournalCommands';

@Service()
export default class SaleInvoicesCost {
  @Inject()
  inventoryService: InventoryService;

  @Inject()
  tenancy: TenancyService;

  /**
   * Schedule sale invoice re-compute based on the item
   * cost method and starting date.
   * @param {number[]} itemIds - Inventory items ids.
   * @param {Date} startingDate - Starting compute cost date.
   * @return {Promise<Agenda>}
   */
  async scheduleComputeCostByItemsIds(
    tenantId: number,
    inventoryItemsIds: number[],
    startingDate: Date
  ): Promise<void> {
    const asyncOpers: Promise<[]>[] = [];

    inventoryItemsIds.forEach((inventoryItemId: number) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        inventoryItemId,
        startingDate
      );
      asyncOpers.push(oper);
    });
    await Promise.all([...asyncOpers]);
  }

  /**
   * Retrieve the max dated inventory transactions in the transactions that
   * have the same item id.
   * @param {IInventoryTransaction[]} inventoryTransactions
   * @return {IInventoryTransaction[]}
   */
  getMaxDateInventoryTransactions(
    inventoryTransactions: IInventoryTransaction[]
  ): IInventoryTransaction[] {
    return chain(inventoryTransactions)
      .reduce((acc: any, transaction) => {
        const compatatorDate = acc[transaction.itemId];

        if (
          !compatatorDate ||
          moment(compatatorDate.date).isBefore(transaction.date)
        ) {
          return {
            ...acc,
            [transaction.itemId]: {
              ...transaction,
            },
          };
        }
        return acc;
      }, {})
      .values()
      .value();
  }

  /**
   * Computes items costs by the given inventory transaction.
   * @param {number} tenantId
   * @param {IInventoryTransaction[]} inventoryTransactions
   */
  async computeItemsCostByInventoryTransactions(
    tenantId: number,
    inventoryTransactions: IInventoryTransaction[]
  ) {
    const asyncOpers: Promise<[]>[] = [];
    const reducedTransactions = this.getMaxDateInventoryTransactions(
      inventoryTransactions
    );
    reducedTransactions.forEach((transaction) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        transaction.itemId,
        transaction.date
      );
      asyncOpers.push(oper);
    });
    await Promise.all([...asyncOpers]);
  }

  /**
   * Schedule writing journal entries.
   * @param {Date} startingDate
   * @return {Promise<agenda>}
   */
  scheduleWriteJournalEntries(tenantId: number, startingDate?: Date) {
    const agenda = Container.get('agenda');

    return agenda.schedule('in 3 seconds', 'rewrite-invoices-journal-entries', {
      startingDate,
      tenantId,
    });
  }

  /**
   * Grpups by transaction type and id the inventory transactions.
   * @param {IInventoryTransaction} invTransactions
   * @returns
   */
  inventoryTransactionsGroupByType(
    invTransactions: { transactionType: string; transactionId: number }[]
  ): { transactionType: string; transactionId: number }[][] {
    return chain(invTransactions)
      .groupBy((t) => `${t.transactionType}-${t.transactionId}`)
      .values()
      .value();
  }

  /**
   * Writes journal entries from sales invoices.
   * @param {number} tenantId - The tenant id.
   * @param {Date} startingDate - Starting date.
   * @param {boolean} override
   */
  async writeInventoryCostJournalEntries(
    tenantId: number,
    startingDate: Date,
    override: boolean
  ) {
    const { InventoryCostLotTracker } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const inventoryCostLotTrans = await InventoryCostLotTracker.query()
      .where('direction', 'OUT')
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .where('cost', '>', 0)
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    const accountsDepGraph = await accountRepository.getDependencyGraph();

    const journal = new JournalPoster(tenantId, accountsDepGraph);
    const journalCommands = new JournalCommands(journal);

    // Groups the inventory cost lots transactions.
    const inventoryTransactions = this.inventoryTransactionsGroupByType(
      inventoryCostLotTrans
    );
    if (override) {
      await journalCommands.revertInventoryCostJournalEntries(startingDate);
    }
    inventoryTransactions.forEach((inventoryLots) => {
      journalCommands.saleInvoiceInventoryCost(inventoryLots);
    });

    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }
}
