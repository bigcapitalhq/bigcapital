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
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const saleReceipt = await SaleReceipt.query(trx)
      .findById(saleReceiptId)
      .withGraphFetched('entries.item');

    // Find or create the discount expense account.
    const discountAccount = await accountRepository.findOrCreateDiscountAccount(
      {},
      trx
    );
    // Find or create the other charges account.
    const otherChargesAccount =
      await accountRepository.findOrCreateOtherChargesAccount({}, trx);

    // Retrieve the income entries ledger.
    const incomeLedger = this.getIncomeEntriesLedger(
      saleReceipt,
      discountAccount.id,
      otherChargesAccount.id
    );

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
  private getIncomeEntriesLedger = (
    saleReceipt: ISaleReceipt,
    discountAccountId: number,
    otherChargesAccountId: number
  ): Ledger => {
    const entries = this.getIncomeGLEntries(
      saleReceipt,
      discountAccountId,
      otherChargesAccountId
    );

    return new Ledger(entries);
  };

  /**
   * Retireves the income GL common entry.
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
   * Retrieve receipt income item G/L entry.
   * @param {ISaleReceipt} saleReceipt -
   * @param {IItemEntry} entry -
   * @param {number} index -
   * @returns {ILedgerEntry}
   */
  private getReceiptIncomeItemEntry = R.curry(
    (
      saleReceipt: ISaleReceipt,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getIncomeGLCommonEntry(saleReceipt);
      const totalLocal = entry.totalExcludingTax * saleReceipt.exchangeRate;

      return {
        ...commonEntry,
        credit: totalLocal,
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
      debit: saleReceipt.totalLocal,
      accountId: saleReceipt.depositAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the discount GL entry.
   * @param {ISaleReceipt} saleReceipt
   * @param {number} discountAccountId
   * @returns {ILedgerEntry}
   */
  private getDiscountEntry = (
    saleReceipt: ISaleReceipt,
    discountAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry(saleReceipt);

    return {
      ...commonEntry,
      debit: saleReceipt.discountAmountLocal,
      accountId: discountAccountId,
      index: 1,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieves the adjustment GL entry.
   * @param {ISaleReceipt} saleReceipt
   * @param {number} adjustmentAccountId
   * @returns {ILedgerEntry}
   */
  private getAdjustmentEntry = (
    saleReceipt: ISaleReceipt,
    adjustmentAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry(saleReceipt);
    const adjustmentAmount = Math.abs(saleReceipt.adjustmentLocal);

    return {
      ...commonEntry,
      debit: saleReceipt.adjustmentLocal < 0 ? adjustmentAmount : 0,
      credit: saleReceipt.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: adjustmentAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the income GL entries.
   * @param   {ISaleReceipt} saleReceipt -
   * @returns {ILedgerEntry[]}
   */
  private getIncomeGLEntries = (
    saleReceipt: ISaleReceipt,
    discountAccountId: number,
    otherChargesAccountId: number
  ): ILedgerEntry[] => {
    const getItemEntry = this.getReceiptIncomeItemEntry(saleReceipt);

    const creditEntries = saleReceipt.entries.map(getItemEntry);
    const depositEntry = this.getReceiptDepositEntry(saleReceipt);
    const discountEntry = this.getDiscountEntry(saleReceipt, discountAccountId);
    const adjustmentEntry = this.getAdjustmentEntry(
      saleReceipt,
      otherChargesAccountId
    );
    return [depositEntry, ...creditEntries, discountEntry, adjustmentEntry];
  };
}
