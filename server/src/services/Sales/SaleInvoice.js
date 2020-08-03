import { omit, sumBy, difference } from 'lodash';
import {
  SaleInvoice,
  AccountTransaction,
  Account,
  Item,
  ItemEntry,
  Customer,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import ServiceItemsEntries from '@/services/Sales/ServiceItemsEntries';

export default class SaleInvoicesService extends ServiceItemsEntries {
  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @param {ISaleInvoice}
   * @return {ISaleInvoice}
   */
  static async createSaleInvoice(saleInvoice) {
    const balance = sumBy(saleInvoice.entries, 'amount');
    const storedInvoice = await SaleInvoice.tenant()
      .query()
      .insert({
        ...omit(saleInvoice, ['entries']),
        balance,
        payment_amount: 0,
      });
    const opers = [];

    saleInvoice.entries.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleInvoice',
          reference_id: storedInvoice.id,
          ...omit(entry, ['amount', 'id']),
        });
      opers.push(oper);
    });
    const incrementOper = Customer.incrementBalance(
      saleInvoice.customer_id,
      balance,
    );
    await Promise.all([...opers, incrementOper]);
    return storedInvoice;
  }

  /**
   * Records the journal entries of sale invoice.
   * @param {ISaleInvoice} saleInvoice
   * @return {void}
   */
  async recordJournalEntries(saleInvoice) {
    const accountsDepGraph = await Account.depGraph().query().remember();
    const journal = new JournalPoster(accountsDepGraph);
    const receivableTotal = sumBy(saleInvoice.entries, 'total');

    const receivableAccount = await Account.tenant().query();
    const formattedDate = moment(saleInvoice.invoice_date).format('YYYY-MM-DD');

    const saleItemsIds = saleInvoice.entries.map((e) => e.item_id);
    const storedInvoiceItems = await Item.tenant()
      .query()
      .whereIn('id', saleItemsIds);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: saleInvoice.id,
      referenceType: 'SaleInvoice',
      date: formattedDate,
    };
    const totalReceivableEntry = new journalEntry({
      ...commonJournalMeta,
      debit: receivableTotal,
      account: receivableAccount.id,
      accountNormal: 'debit',
    });
    journal.debit(totalReceivableEntry);

    saleInvoice.entries.forEach((entry) => {
      const item = {};
      const incomeEntry = JournalEntry({
        ...commonJournalMeta,
        credit: entry.total,
        account: item.sellAccountId,
        accountNormal: 'credit',
        note: '',
      });

      if (item.type === 'inventory') {
        const inventoryCredit = JournalEntry({
          ...commonJournalMeta,
          credit: entry.total,
          account: item.inventoryAccountId,
          accountNormal: 'credit',
          note: '',
        });
        const costEntry = JournalEntry({
          ...commonJournalMeta,
          debit: entry.total,
          account: item.costAccountId,
          accountNormal: 'debit',
          note: '',
        });
        journal.debit(costEntry);
      }
      journal.credit(incomeEntry);
    });
    await Promise.all([
      journalPoster.saveEntries(),
      journalPoster.saveBalance(),
    ]);
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @param {Integer} saleInvoiceId
   */
  static async deleteSaleInvoice(saleInvoiceId) {
    await SaleInvoice.tenant().query().where('id', saleInvoiceId).delete();
    await ItemEntry.tenant()
      .query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    const invoiceTransactions = await AccountTransaction.tenant()
      .query()
      .whereIn('reference_type', ['SaleInvoice'])
      .where('reference_id', saleInvoiceId)
      .withGraphFetched('account.type');

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    journal.loadEntries(invoiceTransactions);
    journal.removeEntries();

    await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
  }

  /**
   * Edit the given sale invoice.
   * @param {Integer} saleInvoiceId -
   * @param {ISaleInvoice} saleInvoice -
   */
  static async editSaleInvoice(saleInvoiceId, saleInvoice) {
    const updatedSaleInvoices = await SaleInvoice.tenant()
      .query()
      .where('id', saleInvoiceId)
      .update({
        ...omit(saleInvoice, ['entries']),
      });
    const opers = [];
    const entriesIds = saleInvoice.entries.filter((entry) => entry.id);
    const entriesNoIds = saleInvoice.entries.filter((entry) => !entry.id);

    const storedEntries = await ItemEntry.tenant()
      .query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice');

    const entriesIdsShouldDelete = this.entriesShouldDeleted(
      storedEntries,
      entriesIds
    );
    if (entriesIdsShouldDelete.length > 0) {
      const updateOper = ItemEntry.tenant()
        .query()
        .whereIn('id', entriesIdsShouldDelete)
        .delete();
      opers.push(updateOper);
    }
    entriesIds.forEach((entry) => {
      const updateOper = ItemEntry.tenant()
        .query()
        .where('id', entry.id)
        .update({
          ...omit(entry, ['id']),
        });
      opers.push(updateOper);
    });
    entriesNoIds.forEach((entry) => {
      const insertOper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleInvoice',
          reference_id: saleInvoiceId,
          ...omit(entry, ['id']),
        });
      opers.push(insertOper);
    })
    await Promise.all([...opers]);
  }

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Integer} saleInvoiceId 
   */
  static async getSaleInvoiceWithEntries(saleInvoiceId) {
    return SaleInvoice.tenant().query()
      .where('id', saleInvoiceId)
      .withGraphFetched('entries')
      .first();
  }

  /**
   * Detarmines the sale invoice number id exists on the storage.
   * @param {Integer} saleInvoiceId
   * @return {Boolean}
   */
  static async isSaleInvoiceExists(saleInvoiceId) {
    const foundSaleInvoice = await SaleInvoice.tenant()
      .query()
      .where('id', saleInvoiceId);
    return foundSaleInvoice.length !== 0;
  }

  /**
   * Detarmines the sale invoice number exists on the storage.
   * @param {Integer} saleInvoiceNumber
   * @return {Boolean}
   */
  static async isSaleInvoiceNumberExists(saleInvoiceNumber, saleInvoiceId) {
    const foundSaleInvoice = await SaleInvoice.tenant()
      .query()
      .onBuild((query) => {
        query.where('invoice_no', saleInvoiceNumber);

        if (saleInvoiceId) {
          query.whereNot('id', saleInvoiceId);
        }
        return query;
      });
    return foundSaleInvoice.length !== 0;
  }

  /**
   * Detarmine the invoices IDs in bulk and returns the not found ones.
   * @param {Array} invoicesIds
   * @return {Array}
   */
  static async isInvoicesExist(invoicesIds) {
    const storedInvoices = await SaleInvoice.tenant()
      .query()
      .onBuild((builder) => {
        builder.whereIn('id', invoicesIds);
        return builder;
      });
    const storedInvoicesIds = storedInvoices.map((i) => i.id);
    const notStoredInvoices = difference(invoicesIds, storedInvoicesIds);
    return notStoredInvoices;
  }
}
