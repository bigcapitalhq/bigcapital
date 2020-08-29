import { Container } from 'typedi';
import {
  SaleInvoice,
  Account,
  AccountTransaction,
  Item,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import InventoryService from '@/services/Inventory/Inventory';
import { ISaleInvoice, IItemEntry, IItem } from '@/interfaces';
import { ISaleInvoice } from '../../interfaces';

export default class SaleInvoicesCost {
  /**
   * Schedule sale invoice re-compute based on the item
   * cost method and starting date.
   * @param {number[]} itemIds - Inventory items ids.
   * @param {Date} startingDate - Starting compute cost date.
   * @return {Promise<Agenda>}
   */
  static async scheduleComputeItemsCost(inventoryItemsIds: number[], startingDate: Date) {
    const asyncOpers: Promise<[]>[] = [];

    inventoryItemsIds.forEach((inventoryItemId: number) => {
      const oper: Promise<[]> = InventoryService.scheduleComputeItemCost(
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
  static scheduleWriteJournalEntries(startingDate?: Date) {
    const agenda = Container.get('agenda');
    return agenda.schedule('in 3 seconds', 'rewrite-invoices-journal-entries', {
      startingDate,
    });
  }

  /**
   * Writes journal entries from sales invoices.
   * @param {Date} startingDate 
   * @param {boolean} override 
   */
  static async writeJournalEntries(startingDate: Date, override: boolean) {
    const salesInvoices = await SaleInvoice.tenant()
      .query()
      .onBuild((builder: any) => {
        builder.modify('filterDateRange', startingDate);
        builder.orderBy('invoice_date', 'ASC');

        builder.withGraphFetched('entries.item')
        builder.withGraphFetched('costTransactions(groupedEntriesCost)');
      });
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    if (override) {
      const oldTransactions = await AccountTransaction.tenant()
        .query()
        .whereIn('reference_type', ['SaleInvoice'])
        .onBuild((builder: any) => {
          builder.modify('filterDateRange', startingDate);
        })
        .withGraphFetched('account.type');

      journal.loadEntries(oldTransactions);
      journal.removeEntries();
    }
    
    salesInvoices.forEach((saleInvoice: ISaleInvoice) => {
      this.saleInvoiceJournal(saleInvoice, journal);
    });
    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Writes journal entries for given sale invoice.
   * @param {ISaleInvoice} saleInvoice 
   * @param {JournalPoster} journal 
   */
  static saleInvoiceJournal(saleInvoice: ISaleInvoice, journal: JournalPoster) {
    let inventoryTotal: number = 0;
    const receivableAccount = { id: 10 };
    const commonEntry = {
      referenceType: 'SaleInvoice',
      referenceId: saleInvoice.id,
      date: saleInvoice.invoiceDate,
    };
    const costTransactions: Map<number, number> = new Map(
      saleInvoice?.costTransactions?.map((trans: IItemEntry) => [
        trans.entryId, trans.cost,
      ]),
    );
    // XXX Debit - Receivable account.
    const receivableEntry = new JournalEntry({
      ...commonEntry,
      debit: saleInvoice.balance,
      account: receivableAccount.id,
    });
    journal.debit(receivableEntry);

    saleInvoice.entries.forEach((entry: IItemEntry) => {
      const cost: number = costTransactions.get(entry.id);
      const income: number = entry.quantity * entry.rate;
  
      if (entry.item.type === 'inventory' && cost) {
        // XXX Debit - Cost account.
        const costEntry = new JournalEntry({
          ...commonEntry,
          debit: cost,
          account: entry.item.costAccountId,
          note: entry.description,
        });
        journal.debit(costEntry);
        inventoryTotal += cost;
      }
      // XXX Credit - Income account.
      const incomeEntry = new JournalEntry({
        ...commonEntry,
        credit: income,
        account: entry.item.sellAccountId,
        note: entry.description,
      });
      journal.credit(incomeEntry);

      if (inventoryTotal > 0) {
        // XXX Credit - Inventory account.
        const inventoryEntry = new JournalEntry({
          ...commonEntry,
          credit: inventoryTotal,
          account: entry.item.inventoryAccountId,
        });
        journal.credit(inventoryEntry);
      }
    });
  }
}