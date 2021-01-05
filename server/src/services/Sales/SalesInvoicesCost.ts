import { Container, Service, Inject } from 'typedi';
import JournalPoster from 'services/Accounting/JournalPoster';
import InventoryService from 'services/Inventory/Inventory';
import TenancyService from 'services/Tenancy/TenancyService';
import { IInventoryLotCost, IItem } from 'interfaces';
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
  ) {
    const asyncOpers: Promise<[]>[] = [];

    inventoryItemsIds.forEach((inventoryItemId: number) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        inventoryItemId,
        startingDate
      );
      asyncOpers.push(oper);
    });
    return Promise.all([...asyncOpers]);
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
      .modify('groupedEntriesCost')
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .where('cost', '>', 0)
      .withGraphFetched('item');

    const accountsDepGraph = await accountRepository.getDependencyGraph();

    const journal = new JournalPoster(tenantId, accountsDepGraph);
    const journalCommands = new JournalCommands(journal);

    if (override) {
      await journalCommands.revertInventoryCostJournalEntries(startingDate);
    }
    inventoryCostLotTrans.forEach(
      (inventoryCostLot: IInventoryLotCost & { item: IItem }) => {
        journalCommands.saleInvoiceInventoryCost(inventoryCostLot);
      }
    );
    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance()
    ]);
  }
}
