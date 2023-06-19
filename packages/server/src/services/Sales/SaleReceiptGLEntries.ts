import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import {
  AccountNormal,
  ILedgerEntry,
  ISaleReceipt,
  IItemEntry,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class SaleReceiptGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Creates income GL entries.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {Knex.Transaction} trx
   */
  public writeIncomeGLEntries = async (
    tenantId: number,
    saleReceiptId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item');

    // Retrieve the income entries ledger.
    const incomeLedger = this.getIncomeEntriesLedger(saleReceipt);

    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(tenantId, incomeLedger, trx);
  };

  /**
   * Reverts the receipt GL entries.
   * @param   {number} tenantId
   * @param   {number} saleReceiptId
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public revertReceiptGLEntries = async (
    tenantId: number,
    saleReceiptId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      saleReceiptId,
      'SaleReceipt',
      trx
    );
  };

  /**
   * Rewrites the receipt GL entries.
   * @param   {number} tenantId
   * @param   {number} saleReceiptId
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public rewriteReceiptGLEntries = async (
    tenantId: number,
    saleReceiptId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Reverts the receipt GL entries.
    await this.revertReceiptGLEntries(tenantId, saleReceiptId, trx);

    // Writes the income GL entries.
    await this.writeIncomeGLEntries(tenantId, saleReceiptId, trx);
  };

  /**
   * Retrieves the income GL ledger.
   * @param {ISaleReceipt} saleReceipt
   * @returns {Ledger}
   */
  private getIncomeEntriesLedger = (saleReceipt: ISaleReceipt): Ledger => {
    const entries = this.getIncomeGLEntries(saleReceipt);

    return new Ledger(entries);
  };

  /**
   * Retrieves the income GL common entry.
   * @param {ISaleReceipt} saleReceipt -
   */
  private getIncomeGLCommonEntry = (saleReceipt: ISaleReceipt) => {
    return {
      currencyCode: saleReceipt.currencyCode,
      exchangeRate: saleReceipt.exchangeRate,

      transactionType: 'SaleReceipt',
      transactionId: saleReceipt.id,

      date: saleReceipt.receiptDate,

      transactionNumber: saleReceipt.receiptNumber,
      referenceNumber: saleReceipt.referenceNo,

      createdAt: saleReceipt.createdAt,

      credit: 0,
      debit: 0,

      userId: saleReceipt.userId,
      branchId: saleReceipt.branchId,
    };
  };

  /**
   * Retrieve receipt income item GL entry.
   * @param   {ISaleReceipt} saleReceipt -
   * @param   {IItemEntry} entry -
   * @param   {number} index -
   * @returns {ILedgerEntry}
   */
  private getReceiptIncomeItemEntry = R.curry(
    (
      saleReceipt: ISaleReceipt,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getIncomeGLCommonEntry(saleReceipt);
      const itemIncome = entry.amount * saleReceipt.exchangeRate;

      return {
        ...commonEntry,
        credit: itemIncome,
        accountId: entry.item.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountNormal: AccountNormal.CREDIT,
      };
    }
  );

  /**
   * Retrieves the receipt deposit GL deposit entry.
   * @param   {ISaleReceipt} saleReceipt
   * @returns {ILedgerEntry}
   */
  private getReceiptDepositEntry = (
    saleReceipt: ISaleReceipt
  ): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry(saleReceipt);

    return {
      ...commonEntry,
      debit: saleReceipt.localAmount,
      accountId: saleReceipt.depositAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the income GL entries.
   * @param   {ISaleReceipt} saleReceipt -
   * @returns {ILedgerEntry[]}
   */
  private getIncomeGLEntries = (saleReceipt: ISaleReceipt): ILedgerEntry[] => {
    const getItemEntry = this.getReceiptIncomeItemEntry(saleReceipt);

    const creditEntries = saleReceipt.entries.map(getItemEntry);
    const depositEntry = this.getReceiptDepositEntry(saleReceipt);

    return [depositEntry, ...creditEntries];
  };
}
