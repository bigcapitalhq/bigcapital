import { Service, Inject } from 'typedi';
import { omit, sumBy, difference, pick, chain } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ISaleInvoice, ISaleInvoiceOTD, IItemEntry, ISalesInvoicesFilter, IPaginationMeta, IFilterMeta } from 'interfaces';
import JournalPoster from 'services/Accounting/JournalPoster';
import HasItemsEntries from 'services/Sales/HasItemsEntries';
import InventoryService from 'services/Inventory/Inventory';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { formatDateFields } from 'utils';

/**
 * Sales invoices service
 * @service
 */
@Service()
export default class SaleInvoicesService extends SalesInvoicesCost {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  itemsEntriesService: HasItemsEntries;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param {number} tenantId = 
   * @param {ISaleInvoice} saleInvoiceDTO - 
   * @return {ISaleInvoice}
   */
  public async createSaleInvoice(tenantId: number, saleInvoiceDTO: ISaleInvoiceOTD) {
    const { SaleInvoice, Customer, ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, e => ItemEntry.calcAmount(e));
    const invLotNumber = await this.inventoryService.nextLotNumber(tenantId);
    
    const saleInvoice: ISaleInvoice = {
      ...formatDateFields(saleInvoiceDTO, ['invoice_date', 'due_date']),
      balance,
      paymentAmount: 0,
      invLotNumber,
    };

    this.logger.info('[sale_invoice] inserting sale invoice to the storage.');
    const storedInvoice = await SaleInvoice.query()
      .insert({
        ...omit(saleInvoice, ['entries']),
      });
    const opers: Array<any> = [];

    this.logger.info('[sale_invoice] inserting sale invoice entries to the storage.');
    saleInvoice.entries.forEach((entry: any) => {
      const oper = ItemEntry.query()
        .insertAndFetch({
          reference_type: 'SaleInvoice',
          reference_id: storedInvoice.id,
          ...omit(entry, ['amount', 'id']),
        }).then((itemEntry) => {
          entry.id = itemEntry.id;
        });
      opers.push(oper);
    });

    this.logger.info('[sale_invoice] trying to increment the customer balance.');
    // Increment the customer balance after deliver the sale invoice.
    const incrementOper = Customer.incrementBalance(
      saleInvoice.customer_id,
      balance,
    );

    // Await all async operations.
    await Promise.all([ ...opers, incrementOper ]);

    // Records the inventory transactions for inventory items.
    await this.recordInventoryTranscactions(tenantId, saleInvoice, storedInvoice.id);

    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeInvoiceItemsCost(tenantId, storedInvoice.id);

    return storedInvoice;
  }

  /**
   * Edit the given sale invoice.
   * @async
   * @param {number} tenantId -
   * @param {Number} saleInvoiceId -
   * @param {ISaleInvoice} saleInvoice -
   */
  public async editSaleInvoice(tenantId: number, saleInvoiceId: number, saleInvoiceDTO: any) {
    const { SaleInvoice, ItemEntry, Customer } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, e => ItemEntry.calcAmount(e));
    const oldSaleInvoice = await SaleInvoice.query()
      .where('id', saleInvoiceId)
      .first();

    const saleInvoice = {
      ...formatDateFields(saleInvoiceDTO, ['invoice_date', 'due_date']),
      balance,
      invLotNumber: oldSaleInvoice.invLotNumber,
    };

    this.logger.info('[sale_invoice] trying to update sale invoice.');
    const updatedSaleInvoices: ISaleInvoice = await SaleInvoice.query()
      .where('id', saleInvoiceId)
      .update({
        ...omit(saleInvoice, ['entries', 'invLotNumber']),
      });
    // Fetches the sale invoice items entries.
    const storedEntries = await ItemEntry.query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice');

    // Patch update the sale invoice items entries.
    const patchItemsEntriesOper = this.itemsEntriesService.patchItemsEntries(
      tenantId, saleInvoice.entries, storedEntries, 'SaleInvoice', saleInvoiceId,
    );

    this.logger.info('[sale_invoice] change customer different balance.');
    // Changes the diff customer balance between old and new amount.
    const changeCustomerBalanceOper = Customer.changeDiffBalance(
      saleInvoice.customer_id,
      oldSaleInvoice.customerId,
      balance,
      oldSaleInvoice.balance,
    );
    // Records the inventory transactions for inventory items.
    const recordInventoryTransOper = this.recordInventoryTranscactions(
      tenantId, saleInvoice, saleInvoiceId, true,
    );
    await Promise.all([
      patchItemsEntriesOper,
      changeCustomerBalanceOper,
      recordInventoryTransOper,
    ]);
    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeInvoiceItemsCost(tenantId, saleInvoiceId, true);
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @async
   * @param {Number} saleInvoiceId - The given sale invoice id.
   */
  public async deleteSaleInvoice(tenantId: number, saleInvoiceId: number) {
    const {
      SaleInvoice,
      ItemEntry,
      Customer,
      Account,
      InventoryTransaction,
      AccountTransaction,
    } = this.tenancy.models(tenantId);

    const oldSaleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries');

    this.logger.info('[sale_invoice] delete sale invoice with entries.');
    await SaleInvoice.query().where('id', saleInvoiceId).delete();
    await ItemEntry.query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    this.logger.info('[sale_invoice] revert the customer balance.');
    const revertCustomerBalanceOper = Customer.changeBalance(
      oldSaleInvoice.customerId,
      oldSaleInvoice.balance * -1,
    );
    const invoiceTransactions = await AccountTransaction.query()
      .whereIn('reference_type', ['SaleInvoice'])
      .where('reference_id', saleInvoiceId)
      .withGraphFetched('account.type');

    const journal = new JournalPoster(tenantId);

    journal.loadEntries(invoiceTransactions);
    journal.removeEntries();

    const inventoryTransactions = await InventoryTransaction.query()
      .where('transaction_type', 'SaleInvoice')
      .where('transaction_id', saleInvoiceId);

    // Revert inventory transactions.
    const revertInventoryTransactionsOper = this.revertInventoryTransactions(
      tenantId,
      inventoryTransactions,
    );
    // Await all async operations.
    await Promise.all([
      journal.deleteEntries(),
      journal.saveBalance(),
      revertCustomerBalanceOper,
      revertInventoryTransactionsOper,
    ]);
    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeItemsCost(tenantId, oldSaleInvoice)
  }

  /**
   * Records the inventory transactions from the givne sale invoice input.
   * @param {SaleInvoice} saleInvoice -
   * @param {number} saleInvoiceId -
   * @param {boolean} override -
   */
  private recordInventoryTranscactions(
    tenantId: number,
    saleInvoice,
    saleInvoiceId: number,
    override?: boolean
  ){
    this.logger.info('[sale_invoice] saving inventory transactions');
    const inventortyTransactions = saleInvoice.entries
      .map((entry) => ({
        ...pick(entry, ['item_id', 'quantity', 'rate',]),
        lotNumber: saleInvoice.invLotNumber,
        transactionType: 'SaleInvoice',
        transactionId: saleInvoiceId,
        direction: 'OUT',
        date: saleInvoice.invoice_date,
        entryId: entry.id,
      }));

    return this.inventoryService.recordInventoryTransactions(
      tenantId, inventortyTransactions, override,
    );
  }

  /**
   * Deletes the inventory transactions.
   * @param {string} transactionType 
   * @param {number} transactionId 
   */
  private async revertInventoryTransactions(tenantId: number, inventoryTransactions: array) {
    const { InventoryTransaction } = this.tenancy.models(tenantId);
    const opers: Promise<[]>[] = [];
    
    this.logger.info('[sale_invoice] reverting inventory transactions');

    inventoryTransactions.forEach((trans: any) => {
      switch(trans.direction) {
        case 'OUT':
          if (trans.inventoryTransactionId) {
            const revertRemaining = InventoryTransaction.query()
              .where('id', trans.inventoryTransactionId)
              .where('direction', 'OUT')
              .increment('remaining', trans.quanitity);
  
            opers.push(revertRemaining);
          }
          break;
        case 'IN':
          const removeRelationOper = InventoryTransaction.query()
            .where('inventory_transaction_id', trans.id)
            .where('direction', 'IN')
            .update({
              inventory_transaction_id: null,
            });
          opers.push(removeRelationOper);
          break;
      }
    });
    return Promise.all(opers);
  }

  /**
   * Retrieve sale invoice with associated entries.
   * @async
   * @param {Number} saleInvoiceId 
   */
  public async getSaleInvoiceWithEntries(tenantId: number, saleInvoiceId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    return SaleInvoice.query()
      .where('id', saleInvoiceId)
      .withGraphFetched('entries')
      .withGraphFetched('customer')
      .first();
  }

  /**
   * Detarmines the sale invoice number id exists on the storage.
   * @param {Integer} saleInvoiceId
   * @return {Boolean}
   */
  async isSaleInvoiceExists(tenantId: number, saleInvoiceId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const foundSaleInvoice = await SaleInvoice.query()
      .where('id', saleInvoiceId);

    return foundSaleInvoice.length !== 0;
  }

  /**
   * Detarmines the sale invoice number exists on the storage.
   * @async
   * @param {Number|String} saleInvoiceNumber
   * @param {Number} saleInvoiceId
   * @return {Boolean}
   */
  async isSaleInvoiceNumberExists(
    tenantId: number,
    saleInvoiceNumber: string|number,
    saleInvoiceId: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const foundSaleInvoice = await SaleInvoice.query()
      .onBuild((query: any) => {
        query.where('invoice_no', saleInvoiceNumber);
        if (saleInvoiceId) {
          query.whereNot('id', saleInvoiceId);
        }
        return query;
      });
    return (foundSaleInvoice.length !== 0);
  }

  /**
   * Detarmine the invoices IDs in bulk and returns the not found ones.
   * @param {Array} invoicesIds
   * @return {Array}
   */
  async isInvoicesExist(tenantId: number, invoicesIds: Array<number>) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const storedInvoices = await SaleInvoice.query()
      .onBuild((builder: any) => {
        builder.whereIn('id', invoicesIds);
        return builder;
      });
    const storedInvoicesIds = storedInvoices.map((i) => i.id);
    const notStoredInvoices = difference(invoicesIds, storedInvoicesIds);
    return notStoredInvoices;
  }

  /**
   * Schedules compute sale invoice items cost based on each item 
   * cost method.
   * @param  {ISaleInvoice} saleInvoice 
   * @return {Promise}
   */
  async scheduleComputeInvoiceItemsCost(
    tenantId: number,
    saleInvoiceId: number,
    override?: boolean
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const saleInvoice: ISaleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item');

    const inventoryItemsIds = chain(saleInvoice.entries)
      .filter((entry: IItemEntry) => entry.item.type === 'inventory')
      .map((entry: IItemEntry) => entry.itemId)
      .uniq().value();

    if (inventoryItemsIds.length === 0) {
      await this.writeNonInventoryInvoiceJournals(tenantId, saleInvoice, override);
    } else {
      await this.scheduleComputeItemsCost(
        tenantId,
        inventoryItemsIds,
        saleInvoice.invoice_date,
      );
    }
  }

  /**
   * Writes the sale invoice journal entries.
   * @param {SaleInvoice} saleInvoice -
   */
  async writeNonInventoryInvoiceJournals(
    tenantId: number,
    saleInvoice: ISaleInvoice,
    override: boolean
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const journal = new JournalPoster(tenantId);

    if (override) {
      const oldTransactions = await AccountTransaction.query()
        .where('reference_type', 'SaleInvoice')
        .where('reference_id', saleInvoice.id)
        .withGraphFetched('account.type');

      journal.loadEntries(oldTransactions);
      journal.removeEntries();
    }
    this.saleInvoiceJournal(saleInvoice, journal);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),      
    ]);
  }

  /**
   * Retrieve sales invoices filterable and paginated list.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  public async salesInvoicesList(tenantId: number, salesInvoicesFilter: ISalesInvoicesFilter):
    Promise<{ salesInvoices: ISaleInvoice[], pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, SaleInvoice, salesInvoicesFilter);
    
    this.logger.info('[sale_invoice] try to get sales invoices list.', { tenantId, salesInvoicesFilter });
    const { results, pagination } = await SaleInvoice.query().onBuild((builder) => {
      builder.withGraphFetched('entries');
      builder.withGraphFetched('customer');
      dynamicFilter.buildQuery()(builder);
    }).pagination(
      salesInvoicesFilter.page - 1,
      salesInvoicesFilter.pageSize,
    );
    return { salesInvoices: results, pagination, filterMeta: dynamicFilter.getResponseMeta() };
  }
}
