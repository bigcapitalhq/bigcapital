import { omit, difference, sumBy } from 'lodash';
import {
  SaleReceipt,
  Account,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import ItemEntry from '../../models/ItemEntry';
import JournalPosterService from '@/services/Sales/JournalPosterService';

export default class SalesReceipt extends JournalPosterService {
  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  static async createSaleReceipt(saleReceipt) {
    const amount = sumBy(saleReceipt.entries, 'amount');
    const storedSaleReceipt = await SaleReceipt.tenant()
      .query()
      .insert({
        amount,
        ...omit(saleReceipt, ['entries']),
      });
    const storeSaleReceiptEntriesOpers = [];

    saleReceipt.entries.forEach((entry) => {
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
  static async _recordJournalTransactions(saleReceipt) {
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journalPoster = new JournalPoster(accountsDepGraph);
  }

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  static async editSaleReceipt(saleReceiptId, saleReceipt) {
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

    const storedSaleReceiptsIds = storedSaleReceiptEntries.map((e) => e.id);
    const entriesHasID = saleReceipt.entries.filter((entry) => entry.id);
    const entriesIds = entriesHasID.map((e) => e.id);

    const opers = [];
    const entriesIdsShouldBeDeleted = difference(
      storedSaleReceiptsIds,
      entriesIds
    );
    if (entriesIdsShouldBeDeleted.length > 0) {
      const deleteOper = ItemEntry.tenant()
        .query()
        .whereIn('id', entriesIdsShouldBeDeleted)
        .where('reference_type', 'SaleReceipt')
        .delete();
      opers.push(deleteOper);
    }
    entriesHasID.forEach((entry) => {
      const updateOper = ItemEntry.tenant()
        .query()
        .patchAndFetchById(entry.id, {
          ...omit(entry, ['id']),
        });
      opers.push(updateOper);
    });
    return Promise.all([...opers]);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  static async deleteSaleReceipt(saleReceiptId) {
    await SaleReceipt.tenant().query().where('id', saleReceiptId).delete();
    await ItemEntry.tenant()
      .query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt')
      .delete();

    // Delete all associated journal transactions to payment receive transaction.
    const deleteTransactionsOper = this.deleteJournalTransactions(
      saleReceiptId,
      'SaleReceipt'
    );
    return Promise.all([
      deleteTransactionsOper,
    ]);
  }

  /**
   * Validates the given sale receipt ID exists.
   * @param {Integer} saleReceiptId
   * @returns {Boolean}
   */
  static async isSaleReceiptExists(saleReceiptId) {
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
  static async isSaleReceiptEntriesIDsExists(saleReceiptId, saleReceipt) {
    const entriesIDs = saleReceipt.entries
      .filter((e) => e.id)
      .map((e) => e.id);

    const storedEntries = await ItemEntry.tenant()
      .query()
      .whereIn('id', entriesIDs)
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt');

    const storedEntriesIDs = storedEntries.map((e) => e.id);
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
  static async getSaleReceiptWithEntries(saleReceiptId) {
    const saleReceipt = await SaleReceipt.tenant().query()
      .where('id', saleReceiptId)
      .withGraphFetched('entries');

    return saleReceipt;
  }
}
