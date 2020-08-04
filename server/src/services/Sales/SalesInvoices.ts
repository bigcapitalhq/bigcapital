import { omit, sumBy, difference } from 'lodash';
import {
  SaleInvoice,
  AccountTransaction,
  Account,
  ItemEntry,
  Customer,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';
import CustomerRepository from '@/repositories/CustomerRepository';

/**
 * Sales invoices service
 * @service
 */
export default class SaleInvoicesService {
  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param {ISaleInvoice}
   * @return {ISaleInvoice}
   */
  static async createSaleInvoice(saleInvoice: any) {
    const balance = sumBy(saleInvoice.entries, 'amount');
    const storedInvoice = await SaleInvoice.tenant()
      .query()
      .insert({
        ...omit(saleInvoice, ['entries']),
        balance,
        payment_amount: 0,
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
    const incrementOper = Customer.incrementBalance(
      saleInvoice.customer_id,
      balance,
    );
    await Promise.all([...opers, incrementOper]);
    return storedInvoice;
  }

  /**
   * Edit the given sale invoice.
   * @async
   * @param {Number} saleInvoiceId -
   * @param {ISaleInvoice} saleInvoice -
   */
  static async editSaleInvoice(saleInvoiceId: number, saleInvoice: any) {
    const balance = sumBy(saleInvoice.entries, 'amount');
    const oldSaleInvoice = await SaleInvoice.tenant().query()
      .where('id', saleInvoiceId)
      .first();

    const updatedSaleInvoices = await SaleInvoice.tenant()
      .query()
      .where('id', saleInvoiceId)
      .update({
        balance,
        ...omit(saleInvoice, ['entries']),
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
    await Promise.all([
      patchItemsEntriesOper,
      changeCustomerBalanceOper,
    ]);
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @async
   * @param {Number} saleInvoiceId
   */
  static async deleteSaleInvoice(saleInvoiceId: number) {
    const oldSaleInvoice = await SaleInvoice.tenant().query().findById(saleInvoiceId);

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

    await Promise.all([
      journal.deleteEntries(),
      journal.saveBalance(),
      revertCustomerBalanceOper,
    ]);
  }

  /**
   * Records the journal entries of sale invoice.
   * @async
   * @param {ISaleInvoice} saleInvoice
   * @return {void}
   */
  async recordJournalEntries(saleInvoice: any) {

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
  static async isInvoicesExist(invoicesIds: Array<number>) {
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
