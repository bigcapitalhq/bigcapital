import { Service, Inject } from 'typedi';
import { omit, sumBy, difference, pick, chain } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import {
  ISaleInvoice,
  ISaleInvoiceOTD,
  IItemEntry,
  ISalesInvoicesFilter,
  IPaginationMeta,
  IFilterMeta
} from 'interfaces';
import events from 'subscribers/events';
import JournalPoster from 'services/Accounting/JournalPoster';
import InventoryService from 'services/Inventory/Inventory';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { formatDateFields } from 'utils';
import { ServiceError } from 'exceptions';
import ItemsService from 'services/Items/ItemsService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';
import CustomersService from 'services/Contacts/CustomersService';


const ERRORS = {
  INVOICE_NUMBER_NOT_UNIQUE: 'INVOICE_NUMBER_NOT_UNIQUE',
  SALE_INVOICE_NOT_FOUND: 'SALE_INVOICE_NOT_FOUND',
  ENTRIES_ITEMS_IDS_NOT_EXISTS: 'ENTRIES_ITEMS_IDS_NOT_EXISTS',
  NOT_SELLABLE_ITEMS: 'NOT_SELLABLE_ITEMS',
  SALE_INVOICE_NO_NOT_UNIQUE: 'SALE_INVOICE_NO_NOT_UNIQUE'
};

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
  itemsEntriesService: ItemsEntriesService;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  itemsService: ItemsService;

  @Inject()
  customersService: CustomersService;

  /**
   * 
   * Validate whether sale invoice number unqiue on the storage.
   */
  async validateInvoiceNumberUnique(tenantId: number, invoiceNumber: string, notInvoiceId?: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    
    this.logger.info('[sale_invoice] validating sale invoice number existance.', { tenantId, invoiceNumber });
    const saleInvoice = await SaleInvoice.query()
      .findOne('invoice_no', invoiceNumber)
      .onBuild((builder) => {
        if (notInvoiceId) {
          builder.whereNot('id', notInvoiceId);
        }
      });

    if (saleInvoice) {
      this.logger.info('[sale_invoice] sale invoice number not unique.', { tenantId, invoiceNumber });
      throw new ServiceError(ERRORS.INVOICE_NUMBER_NOT_UNIQUE)
    }
  }

  /**
   * Validate whether sale invoice exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async getInvoiceOrThrowError(tenantId: number, saleInvoiceId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const saleInvoice = await SaleInvoice.query().findById(saleInvoiceId);

    if (!saleInvoice) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_FOUND);
    }
    return saleInvoice;
  }

  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param {number} tenantId = 
   * @param {ISaleInvoice} saleInvoiceDTO - 
   * @return {ISaleInvoice}
   */
  public async createSaleInvoice(tenantId: number, saleInvoiceDTO: ISaleInvoiceOTD): Promise<ISaleInvoice> {
    const { SaleInvoice, ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, e => ItemEntry.calcAmount(e));
    const invLotNumber = 1;

    const saleInvoiceObj: ISaleInvoice = {
      ...formatDateFields(saleInvoiceDTO, ['invoice_date', 'due_date']),
      balance,
      paymentAmount: 0,
      // invLotNumber,
    };

    // Validate customer existance.
    await this.customersService.getCustomerByIdOrThrowError(tenantId, saleInvoiceDTO.customerId);

    // Validate sale invoice number uniquiness.
    await this.validateInvoiceNumberUnique(tenantId, saleInvoiceDTO.invoiceNo);

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, saleInvoiceDTO.entries);
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, saleInvoiceDTO.entries);

    this.logger.info('[sale_invoice] inserting sale invoice to the storage.');
    const saleInvoice = await SaleInvoice.query()
      .insertGraphAndFetch({
        ...omit(saleInvoiceObj, ['entries']),

        entries: saleInvoiceObj.entries.map((entry) => ({
          reference_type: 'SaleInvoice',
          ...omit(entry, ['amount', 'id']),
        }))
      });

    await this.eventDispatcher.dispatch(events.saleInvoice.onCreated, {
      tenantId, saleInvoice, saleInvoiceId: saleInvoice.id,
    });
    this.logger.info('[sale_invoice] successfully inserted.', { tenantId, saleInvoice });

    return saleInvoice;
  }

  /**
   * Edit the given sale invoice.
   * @async
   * @param {number} tenantId - 
   * @param {Number} saleInvoiceId -
   * @param {ISaleInvoice} saleInvoice -
   */
  public async editSaleInvoice(tenantId: number, saleInvoiceId: number, saleInvoiceDTO: any): Promise<ISaleInvoice> {
    const { SaleInvoice, ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, e => ItemEntry.calcAmount(e));
    const oldSaleInvoice = await this.getInvoiceOrThrowError(tenantId, saleInvoiceId);

    const saleInvoiceObj = {
      ...formatDateFields(saleInvoiceDTO, ['invoice_date', 'due_date']),
      balance,
      // invLotNumber: oldSaleInvoice.invLotNumber,
    };

    // Validate customer existance.
    await this.customersService.getCustomerByIdOrThrowError(tenantId, saleInvoiceDTO.customerId);

    // Validate sale invoice number uniquiness.
    await this.validateInvoiceNumberUnique(tenantId, saleInvoiceDTO.invoiceNo, saleInvoiceId);

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, saleInvoiceDTO.entries);

    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, saleInvoiceDTO.entries);

    // Validate the items entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(tenantId, saleInvoiceId, 'SaleInvoice', saleInvoiceDTO.entries);

    this.logger.info('[sale_invoice] trying to update sale invoice.');
    const saleInvoice: ISaleInvoice = await SaleInvoice.query()
      .upsertGraphAndFetch({
        id: saleInvoiceId,
        ...omit(saleInvoiceObj, ['entries', 'invLotNumber']),

        entries: saleInvoiceObj.entries.map((entry) => ({
          reference_type: 'SaleInvoice',
          ...omit(entry, ['amount']),
        }))
      });

    // Triggers `onSaleInvoiceEdited` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onEdited, {
      saleInvoice, oldSaleInvoice, tenantId, saleInvoiceId,
    });

    return saleInvoice;
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @async
   * @param {Number} saleInvoiceId - The given sale invoice id.
   */
  public async deleteSaleInvoice(tenantId: number, saleInvoiceId: number): Promise<void> {
    const { SaleInvoice, ItemEntry } = this.tenancy.models(tenantId);

    const oldSaleInvoice = await this.getInvoiceOrThrowError(tenantId, saleInvoiceId);

    this.logger.info('[sale_invoice] delete sale invoice with entries.');
    await SaleInvoice.query().where('id', saleInvoiceId).delete();
    await ItemEntry.query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    await this.eventDispatcher.dispatch(events.saleInvoice.onDeleted, {
      tenantId, oldSaleInvoice,
    });
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
  public async salesInvoicesList(
    tenantId: number,
    salesInvoicesFilter: ISalesInvoicesFilter
  ): Promise<{ salesInvoices: ISaleInvoice[], pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
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
    return {
      salesInvoices: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
