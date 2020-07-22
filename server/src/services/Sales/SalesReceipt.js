import { omit, difference } from 'lodash';
import {
  SaleReceipt,
  SaleReceiptEntry,
  AccountTransaction,
  Account,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';

export default class SalesReceipt {
  constructor() {}

  /**
   * Creates a new sale receipt with associated entries.
   * @param {ISaleReceipt} saleReceipt
   */
  static async createSaleReceipt(saleReceipt) {
    const storedSaleReceipt = await SaleReceipt.tenant()
      .query()
      .insert({
        ...omit(saleReceipt, ['entries']),
      });
    const storeSaleReceiptEntriesOpers = [];

    saleReceipt.entries.forEach((entry) => {
      const oper = SaleReceiptEntry.tenant()
        .query()
        .insert({
          sale_receipt_id: storedSaleReceipt.id,
          ...entry,
        });
      storeSaleReceiptEntriesOpers.push(oper);
    });
    await Promise.all([...storeSaleReceiptEntriesOpers]);
    return storedSaleReceipt;
  }

  /**
   * Records journal transactions for sale receipt.
   * @param {ISaleReceipt} saleReceipt
   */
  static async _recordJournalTransactions(saleReceipt) {
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journalPoster = new JournalPoster(accountsDepGraph);

    const creditEntry = new journalEntry({
      debit: 0,
      credit: saleReceipt.total,
      account: saleReceipt.incomeAccountId,
      referenceType: 'SaleReceipt',
      referenceId: saleReceipt.id,
      note: saleReceipt.note,
    });
    const debitEntry = new journalEntry({
      debit: saleReceipt.total,
      credit: 0,
      account: saleReceipt.incomeAccountId,
      referenceType: 'SaleReceipt',
      referenceId: saleReceipt.id,
      note: saleReceipt.note,
    });
    journalPoster.credit(creditEntry);
    journalPoster.credit(debitEntry);

    await Promise.all([
      journalPoster.saveEntries(),
      journalPoster.saveBalance(),
    ]);
  }

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  static async editSaleReceipt(saleReceiptId, saleReceipt) {
    const updatedSaleReceipt = await SaleReceipt.tenant()
      .query()
      .where('id', saleReceiptId)
      .update({
        ...omit(saleReceipt, ['entries']),
      });
    const storedSaleReceiptEntries = await SaleReceiptEntry.tenant()
      .query()
      .where('sale_receipt_id', saleReceiptId);

    const storedSaleReceiptsIds = storedSaleReceiptEntries.map((e) => e.id);
    const entriesHasID = saleReceipt.entries.filter((entry) => entry.id);
    const entriesIds = entriesHasID.map((e) => e.id);

    const entriesIdsShouldBeDeleted = difference(
      storedSaleReceiptsIds,
      entriesIds
    );
    const opers = [];

    if (entriesIdsShouldBeDeleted.length > 0) {
      const deleteOper = SaleReceiptEntry.tenant()
        .query()
        .where('id', entriesIdsShouldBeDeleted)
        .delete();
      opers.push(deleteOper);
    }
    entriesHasID.forEach((entry) => {
      const updateOper = SaleReceiptEntry.tenant()
        .query()
        .patchAndFetchById(entry.id, {
          ...omit(entry, ['id']),
        });
      opers.push(updateOper);
    });
    await Promise.all([...opers]);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  static async deleteSaleReceipt(saleReceiptId) {
    await SaleReceipt.tenant().query().where('id', saleReceiptId).delete();
    await SaleReceiptEntry.tenant()
      .query()
      .where('sale_receipt_id', saleReceiptId)
      .delete();

    const receiptTransactions = await AccountTransaction.tenant()
      .query()
      .whereIn('reference_type', ['SaleReceipt'])
      .where('reference_id', saleReceiptId)
      .withGraphFetched('account.type');

    const accountsDepGraph = await Account.tenant()
      .depGraph()
      .query()
      .remember();
    const journal = new JournalPoster(accountsDepGraph);

    journal.loadEntries(receiptTransactions);
    journal.removeEntries();

    await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
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

    const storedEntries = await SaleReceiptEntry.tenant()
      .query()
      .whereIn('id', entriesIDs)
      .where('sale_receipt_id', saleReceiptId);

    const storedEntriesIDs = storedEntries.map((e) => e.id);
    const notFoundEntriesIDs = difference(
      entriesIDs,
      storedEntriesIDs
    );
    return notFoundEntriesIDs;
  }

  static async getSaleReceiptWithEntries(saleReceiptId) {
    const saleReceipt = await SaleReceipt.tenant().query()
      .where('id', saleReceiptId)
      .withGraphFetched('entries');

    return saleReceipt;
  }
}
