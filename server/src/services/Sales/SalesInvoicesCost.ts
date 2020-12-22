import { Container, Service, Inject } from 'typedi';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import InventoryService from 'services/Inventory/Inventory';
import TenancyService from 'services/Tenancy/TenancyService';
import { ISaleInvoice, IItemEntry, IInventoryLotCost, IItem } from 'interfaces';
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
  async scheduleComputeItemsCost(
    tenantId: number,
    inventoryItemsIds: number[],
    startingDate: Date
  ) {
    const asyncOpers: Promise<[]>[] = [];

    inventoryItemsIds.forEach((inventoryItemId: number) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        inventoryItemId,
        startingDate,
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
      startingDate, tenantId,
    });
  }

  /**
   * Writes journal entries from sales invoices.
   * @param {number} tenantId - The tenant id.
   * @param {Date} startingDate 
   * @param {boolean} override 
   */
  async writeJournalEntries(tenantId: number, startingDate: Date, override: boolean) {
    const { AccountTransaction, SaleInvoice, Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const receivableAccount = await accountRepository.findOne({
      slug: 'accounts-receivable',
    });
    const salesInvoices = await SaleInvoice.query()
      .onBuild((builder: any) => {
        builder.modify('filterDateRange', startingDate);
        builder.orderBy('invoice_date', 'ASC');

        builder.withGraphFetched('entries.item');
        builder.withGraphFetched('costTransactions(groupedEntriesCost)');
      });
    const accountsDepGraph = await accountRepository.getDependencyGraph();
    const journal = new JournalPoster(tenantId, accountsDepGraph);

    const journalCommands = new JournalCommands(journal);

    if (override) {
      const oldTransactions = await AccountTransaction.query()
        .whereIn('reference_type', ['SaleInvoice'])
        .onBuild((builder: any) => {
          builder.modify('filterDateRange', startingDate);
        })
        .withGraphFetched('account.type');

      journal.fromTransactions(oldTransactions);
      journal.removeEntries();
    }
    salesInvoices.forEach((saleInvoice: ISaleInvoice & {
      costTransactions: IInventoryLotCost[],
      entries: IItemEntry & { item: IItem },
    }) => {
      journalCommands.saleInvoice(saleInvoice, receivableAccount.id);
    });
    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Writes the sale invoice journal entries.
   * @param {SaleInvoice} saleInvoice -
   */
  async writeNonInventoryInvoiceEntries(
    tenantId: number,
    saleInvoice: ISaleInvoice,
    override: boolean
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Receivable account.
    const receivableAccount = await accountRepository.findOne({
      slug: 'accounts-receivable',
    });
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    if (override) {
      const oldTransactions = await AccountTransaction.query()
        .where('reference_type', 'SaleInvoice')
        .where('reference_id', saleInvoice.id)
        .withGraphFetched('account.type');

      journal.fromTransactions(oldTransactions);
      journal.removeEntries();
    }
    journalCommands.saleInvoiceNonInventory(saleInvoice, receivableAccount.id);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }
}