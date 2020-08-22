import { omit, sumBy, difference, pick } from 'lodash';
import {
  SaleInvoice,
  AccountTransaction,
  InventoryTransaction,
  Account,
  ItemEntry,
  Customer,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';
import CustomerRepository from '@/repositories/CustomerRepository';
import InventoryService from '@/services/Inventory/Inventory';
import { formatDateFields } from '@/utils';
import { Item } from '../../models';
import JournalCommands from '../Accounting/JournalCommands';

/**
 * Sales invoices service
 * @service
 */
export default class SaleInvoicesService {

  static filterNonInventoryEntries(entries: [], items: []) {
    const nonInventoryItems = items.filter((item: any) => item.type !== 'inventory');
    const nonInventoryItemsIds = nonInventoryItems.map((i: any) => i.id);

    return entries
      .filter((entry: any) => (
        (nonInventoryItemsIds.indexOf(entry.item_id)) !== -1
      ));
  }

  static filterInventoryEntries(entries: [], items: []) {
    const inventoryItems = items.filter((item: any) => item.type === 'inventory');
    const inventoryItemsIds = inventoryItems.map((i: any) => i.id);

    return entries
      .filter((entry: any) => (
        (inventoryItemsIds.indexOf(entry.item_id)) !== -1
      ));
  }
  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param {ISaleInvoice}
   * @return {ISaleInvoice}
   */
  static async createSaleInvoice(saleInvoiceDTO: any) {
    const balance = sumBy(saleInvoiceDTO.entries, 'amount');
    const invLotNumber = await InventoryService.nextLotNumber();
    const saleInvoice = {
      ...formatDateFields(saleInvoiceDTO, ['invoide_date', 'due_date']),
      balance,
      paymentAmount: 0,
      invLotNumber,
    };
    const storedInvoice = await SaleInvoice.tenant()
      .query()
      .insert({
        ...omit(saleInvoice, ['entries']),
      });
    const opers: Array<any> = [];

    saleInvoice.entries.forEach((entry: any) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleInvoice',
          reference_id: storedInvoice.id,
          ...omit(entry, ['amount', 'id']),
        });
      opers.push(oper);
    });
    // Increment the customer balance after deliver the sale invoice.
    const incrementOper = Customer.incrementBalance(
      saleInvoice.customer_id,
      balance,
    );
    // Records the inventory transactions for inventory items.
    const recordInventoryTransOpers = this.recordInventoryTranscactions(
      saleInvoice, storedInvoice.id
    );
    // Records the non-inventory transactions of the entries items.
    const recordNonInventoryJEntries = this.recordNonInventoryEntries(
      saleInvoice, storedInvoice.id,
    );
    // Await all async operations.
    await Promise.all([
      ...opers,
      incrementOper,
      recordNonInventoryJEntries,
      recordInventoryTransOpers,
    ]);
    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    // await this.scheduleComputeItemsCost(saleInvoice);
    return storedInvoice;
  }

  /**
   * Records the journal entries for non-inventory entries.
   * @param {SaleInvoice} saleInvoice 
   */
  static async recordNonInventoryEntries(saleInvoice: any, saleInvoiceId: number) {
    const saleInvoiceItems = saleInvoice.entries.map((entry: any) => entry.item_id);

    // Retrieves items data to detarmines whether the item type.
    const itemsMeta = await Item.tenant().query().whereIn('id', saleInvoiceItems);
    const storedItemsMap = new Map(itemsMeta.map((item) => [item.id, item]));

    // Filters the non-inventory and inventory entries based on the item type.
    const nonInventoryEntries: any[] = this.filterNonInventoryEntries(saleInvoice.entries, itemsMeta);

    const transactions: any = [];
    const common = {
      referenceType: 'SaleInvoice',
      referenceId: saleInvoiceId,
      date: saleInvoice.invoice_date,
    };
    nonInventoryEntries.forEach((entry) => {
      const item = storedItemsMap.get(entry.item_id);

      transactions.push({
        ...common,
        income: entry.amount,
        incomeAccountId: item.incomeAccountId,
      })
    });
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);
    const journalCommands = new JournalCommands(journal);

    journalCommands.nonInventoryEntries(transactions);

    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Edit the given sale invoice.
   * @async
   * @param {Number} saleInvoiceId -
   * @param {ISaleInvoice} saleInvoice -
   */
  static async editSaleInvoice(saleInvoiceId: number, saleInvoiceDTO: any) {
    const balance = sumBy(saleInvoiceDTO.entries, 'amount');
    const oldSaleInvoice = await SaleInvoice.tenant().query()
      .where('id', saleInvoiceId)
      .first();

    const saleInvoice = {
      ...formatDateFields(saleInvoiceDTO, ['invoice_date', 'due_date']),
      balance,
      invLotNumber: oldSaleInvoice.invLotNumber,
    };
    const updatedSaleInvoices = await SaleInvoice.tenant()
      .query()
      .where('id', saleInvoiceId)
      .update({
        ...omit(saleInvoice, ['entries', 'invLotNumber']),
      });
    // Fetches the sale invoice items entries.
    const storedEntries = await ItemEntry.tenant()
      .query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice');

    // Patch update the sale invoice items entries.
    const patchItemsEntriesOper = HasItemsEntries.patchItemsEntries(
      saleInvoice.entries, storedEntries, 'SaleInvoice', saleInvoiceId,
    );
    // Changes the diff customer balance between old and new amount.
    const changeCustomerBalanceOper = CustomerRepository.changeDiffBalance(
      saleInvoice.customer_id,
      oldSaleInvoice.customerId,
      balance,
      oldSaleInvoice.balance,
    );
    // Records the inventory transactions for inventory items.
    const recordInventoryTransOper = this.recordInventoryTranscactions(
      saleInvoice, saleInvoiceId, true,
    );
    await Promise.all([
      patchItemsEntriesOper,
      changeCustomerBalanceOper,
      recordInventoryTransOper,
    ]);

    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeItemsCost(saleInvoice); 
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @async
   * @param {Number} saleInvoiceId
   */
  static async deleteSaleInvoice(saleInvoiceId: number) {
    const oldSaleInvoice = await SaleInvoice.tenant().query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries');

    await SaleInvoice.tenant().query().where('id', saleInvoiceId).delete();
    await ItemEntry.tenant()
      .query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    const revertCustomerBalanceOper = Customer.changeBalance(
      oldSaleInvoice.customerId,
      oldSaleInvoice.balance * -1,
    );
    const invoiceTransactions = await AccountTransaction.tenant()
      .query()
      .whereIn('reference_type', ['SaleInvoice'])
      .where('reference_id', saleInvoiceId)
      .withGraphFetched('account.type');

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    journal.loadEntries(invoiceTransactions);
    journal.removeEntries();

    const inventoryTransactions = await InventoryTransaction.tenant()
      .query()
      .where('transaction_type', 'SaleInvoice')
      .where('transaction_id', saleInvoiceId);

    // Revert inventory transactions.
    const revertInventoryTransactionsOper = this.revertInventoryTransactions(
      inventoryTransactions
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
    await this.scheduleComputeItemsCost(oldSaleInvoice)
  }

  /**
   * Records the inventory transactions from the givne sale invoice input.
   * @param {SaleInvoice} saleInvoice -
   * @param {number} saleInvoiceId -
   * @param {boolean} override -
   */
  static recordInventoryTranscactions(saleInvoice, saleInvoiceId: number, override?: boolean){
    const inventortyTransactions = saleInvoice.entries
      .map((entry) => ({
        ...pick(entry, ['item_id', 'quantity', 'rate']),
        lotNumber: saleInvoice.invLotNumber,
        transactionType: 'SaleInvoice',
        transactionId: saleInvoiceId,
        direction: 'OUT',
        date: saleInvoice.invoice_date,
      }));

    return InventoryService.recordInventoryTransactions(
      inventortyTransactions, override,
    );
  }

  /**
   * Schedule sale invoice re-compute based on the item
   * cost method and starting date
   * 
   * @private
   * @param {SaleInvoice} saleInvoice - 
   * @return {Promise<Agenda>}
   */
  private static scheduleComputeItemsCost(saleInvoice: any) {
    const asyncOpers: Promise<[]>[] = [];

    saleInvoice.entries.forEach((entry: any) => {
      const oper: Promise<[]> = InventoryService.scheduleComputeItemCost(
        entry.item_id || entry.itemId,
        saleInvoice.bill_date || saleInvoice.billDate,
      );
      asyncOpers.push(oper);
    });
    return Promise.all(asyncOpers);
  }

  /**
   * Deletes the inventory transactions.
   * @param {string} transactionType 
   * @param {number} transactionId 
   */
  static async revertInventoryTransactions(inventoryTransactions: array) {
    const opers: Promise<[]>[] = [];

    inventoryTransactions.forEach((trans: any) => {
      switch(trans.direction) {
        case 'OUT':
          if (trans.inventoryTransactionId) {
            const revertRemaining = InventoryTransaction.tenant()
              .query()
              .where('id', trans.inventoryTransactionId)
              .where('direction', 'OUT')
              .increment('remaining', trans.quanitity);
  
            opers.push(revertRemaining);
          }
          break;
        case 'IN':
          const removeRelationOper = InventoryTransaction.tenant()
            .query()
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
  static async getSaleInvoiceWithEntries(saleInvoiceId: number) {
    return SaleInvoice.tenant().query()
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
  static async isSaleInvoiceExists(saleInvoiceId: number) {
    const foundSaleInvoice = await SaleInvoice.tenant()
      .query()
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
  static async isSaleInvoiceNumberExists(saleInvoiceNumber: string|number, saleInvoiceId: number) {
    const foundSaleInvoice = await SaleInvoice.tenant()
      .query()
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
  static async isInvoicesExist(invoicesIds: Array<number>) {
    const storedInvoices = await SaleInvoice.tenant()
      .query()
      .onBuild((builder: any) => {
        builder.whereIn('id', invoicesIds);
        return builder;
      });
    const storedInvoicesIds = storedInvoices.map((i) => i.id);
    const notStoredInvoices = difference(invoicesIds, storedInvoicesIds);
    return notStoredInvoices;
  }
}
