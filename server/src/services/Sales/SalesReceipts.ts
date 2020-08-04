import { omit, difference, sumBy } from 'lodash';
import {
  SaleReceipt,
  Account,
  ItemEntry,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import HasItemEntries from '@/services/Sales/HasItemsEntries';

export default class SalesReceipt {
  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  static async createSaleReceipt(saleReceipt: any) {
    const amount = sumBy(saleReceipt.entries, 'amount');
    const storedSaleReceipt = await SaleReceipt.tenant()
      .query()
      .insert({
        amount,
        ...omit(saleReceipt, ['entries']),
      });
    const storeSaleReceiptEntriesOpers: Array<any> = [];

    saleReceipt.entries.forEach((entry: any) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'SaleReceipt',
          reference_id: storedSaleReceipt.id,
          ...omit(entry, ['id', 'amount']),
        });
      storeSaleReceiptEntriesOpers.push(oper);
    });
    await Promise.all([...storeSaleReceiptEntriesOpers]);
    return storedSaleReceipt;
  }

  /**
   * Records journal transactions for sale receipt.
   * @param {ISaleReceipt} saleReceipt
   * @return {Promise}
   */
  static async _recordJournalTransactions(saleReceipt: any) {
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journalPoster = new JournalPoster(accountsDepGraph);
  }

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  static async editSaleReceipt(saleReceiptId: number, saleReceipt: any) {
    const amount = sumBy(saleReceipt.entries, 'amount');
    const updatedSaleReceipt = await SaleReceipt.tenant()
      .query()
      .where('id', saleReceiptId)
      .update({
        amount,
        ...omit(saleReceipt, ['entries']),
      });
    const storedSaleReceiptEntries = await ItemEntry.tenant()
      .query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt');

    // Patch sale receipt items entries.
    const patchItemsEntries = HasItemEntries.patchItemsEntries(
      saleReceipt.entries, storedSaleReceiptEntries, 'SaleReceipt', saleReceiptId,
    );
    return Promise.all([patchItemsEntries]);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  static async deleteSaleReceipt(saleReceiptId: number) {
    const deleteSaleReceiptOper = SaleReceipt.tenant().query().where('id', saleReceiptId).delete();
    const deleteItemsEntriesOper = ItemEntry.tenant()
      .query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt')
      .delete();

    // Delete all associated journal transactions to payment receive transaction.
    const deleteTransactionsOper = JournalPosterService.deleteJournalTransactions(
      saleReceiptId,
      'SaleReceipt'
    );
    return Promise.all([
      deleteItemsEntriesOper,
      deleteSaleReceiptOper,
      deleteTransactionsOper,
    ]);
  }

  /**
   * Validates the given sale receipt ID exists.
   * @param {Integer} saleReceiptId
   * @returns {Boolean}
   */
  static async isSaleReceiptExists(saleReceiptId: number) {
    const foundSaleReceipt = await SaleReceipt.tenant()
      .query()
      .where('id', saleReceiptId);
    return foundSaleReceipt.length !== 0;
  }

  /**
   * Detarmines the sale receipt entries IDs exists.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   */
  static async isSaleReceiptEntriesIDsExists(saleReceiptId: number, saleReceipt: any) {
    const entriesIDs = saleReceipt.entries
      .filter((e) => e.id)
      .map((e) => e.id);

    const storedEntries = await ItemEntry.tenant()
      .query()
      .whereIn('id', entriesIDs)
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt');

    const storedEntriesIDs = storedEntries.map((e: any) => e.id);
    const notFoundEntriesIDs = difference(
      entriesIDs,
      storedEntriesIDs
    );
    return notFoundEntriesIDs;
  }

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId 
   */
  static async getSaleReceiptWithEntries(saleReceiptId: number) {
    const saleReceipt = await SaleReceipt.tenant().query()
      .where('id', saleReceiptId)
      .withGraphFetched('entries');

    return saleReceipt;
  }
}
