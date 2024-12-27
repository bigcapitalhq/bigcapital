import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import * as R from 'ramda';
import {
  IVendorCredit,
  ILedgerEntry,
  AccountNormal,
  IItemEntry,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export default class VendorCreditGLEntries {
  @Inject()
  private ledgerStorage: LedgerStorageService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve the vendor credit GL common entry.
   * @param   {IVendorCredit} vendorCredit
   * @returns {}
   */
  public getVendorCreditGLCommonEntry = (vendorCredit: IVendorCredit) => {
    return {
      date: vendorCredit.vendorCreditDate,
      currencyCode: vendorCredit.currencyCode,
      exchangeRate: vendorCredit.exchangeRate,

      transactionId: vendorCredit.id,
      transactionType: 'VendorCredit',
      transactionNumber: vendorCredit.vendorCreditNumber,
      referenceNumber: vendorCredit.referenceNo,

      credit: 0,
      debit: 0,

      branchId: vendorCredit.branchId,
    };
  };

  /**
   * Retrieves the vendor credit payable GL entry.
   * @param   {IVendorCredit} vendorCredit
   * @param   {number} APAccountId
   * @returns {ILedgerEntry}
   */
  public getVendorCreditPayableGLEntry = (
    vendorCredit: IVendorCredit,
    APAccountId: number
  ): ILedgerEntry => {
    const commonEntity = this.getVendorCreditGLCommonEntry(vendorCredit);

    return {
      ...commonEntity,
      debit: vendorCredit.totalLocal,
      accountId: APAccountId,
      contactId: vendorCredit.vendorId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the vendor credit item GL entry.
   * @param   {IVendorCredit} vendorCredit
   * @param   {IItemEntry} entry
   * @returns {ILedgerEntry}
   */
  public getVendorCreditGLItemEntry = R.curry(
    (
      vendorCredit: IVendorCredit,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntity = this.getVendorCreditGLCommonEntry(vendorCredit);
      const totalLocal = entry.totalExcludingTax * vendorCredit.exchangeRate;

      return {
        ...commonEntity,
        credit: totalLocal,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountId:
          'inventory' === entry.item.type
            ? entry.item.inventoryAccountId
            : entry.costAccountId || entry.item.costAccountId,
        accountNormal: AccountNormal.DEBIT,
      };
    }
  );

  /**
   * Retrieves the vendor credit discount GL entry.
   * @param {IVendorCredit} vendorCredit
   * @param {number} discountAccountId
   * @returns {ILedgerEntry}
   */
  public getDiscountEntry = (
    vendorCredit: IVendorCredit,
    purchaseDiscountAccountId: number
  ) => {
    const commonEntry = this.getVendorCreditGLCommonEntry(vendorCredit);

    return {
      ...commonEntry,
      debit: vendorCredit.discountAmountLocal,
      accountId: purchaseDiscountAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  };

  /**
   * Retrieves the vendor credit adjustment GL entry.
   * @param {IVendorCredit} vendorCredit
   * @param {number} adjustmentAccountId
   * @returns {ILedgerEntry}
   */
  public getAdjustmentEntry = (
    vendorCredit: IVendorCredit,
    otherExpensesAccountId: number
  ) => {
    const commonEntry = this.getVendorCreditGLCommonEntry(vendorCredit);
    const adjustmentAmount = Math.abs(vendorCredit.adjustmentLocal);

    return {
      ...commonEntry,
      credit: vendorCredit.adjustmentLocal > 0 ? adjustmentAmount : 0,
      debit: vendorCredit.adjustmentLocal < 0 ? adjustmentAmount : 0,
      accountId: otherExpensesAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  };

  /**
   * Retrieve the vendor credit GL entries.
   * @param  {IVendorCredit} vendorCredit -
   * @param  {number} receivableAccount -
   * @return {ILedgerEntry[]}
   */
  public getVendorCreditGLEntries = (
    vendorCredit: IVendorCredit,
    payableAccountId: number,
    purchaseDiscountAccountId: number,
    otherExpensesAccountId: number
  ): ILedgerEntry[] => {
    const payableEntry = this.getVendorCreditPayableGLEntry(
      vendorCredit,
      payableAccountId
    );
    const getItemEntry = this.getVendorCreditGLItemEntry(vendorCredit);
    const itemsEntries = vendorCredit.entries.map(getItemEntry);

    const discountEntry = this.getDiscountEntry(
      vendorCredit,
      purchaseDiscountAccountId
    );
    const adjustmentEntry = this.getAdjustmentEntry(
      vendorCredit,
      otherExpensesAccountId
    );
    return [payableEntry, discountEntry, adjustmentEntry, ...itemsEntries];
  };

  /**
   * Reverts the vendor credit associated GL entries.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public revertVendorCreditGLEntries = async (
    tenantId: number,
    vendorCreditId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      vendorCreditId,
      'VendorCredit',
      trx
    );
  };

  /**
   * Creates vendor credit associated GL entries.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public writeVendorCreditGLEntries = async (
    tenantId: number,
    vendorCreditId: number,
    trx?: Knex.Transaction
  ) => {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Vendor credit with entries items.
    const vendorCredit = await VendorCredit.query(trx)
      .findById(vendorCreditId)
      .withGraphFetched('entries.item');

    // Retrieve the payable account (A/P) account.
    const APAccount = await accountRepository.findOrCreateAccountsPayable(
      vendorCredit.currencyCode,
      {},
      trx
    );
    const purchaseDiscountAccount =
      await accountRepository.findOrCreatePurchaseDiscountAccount({}, trx);

    const otherExpensesAccount =
      await accountRepository.findOrCreateOtherExpensesAccount({}, trx);
    // Saves the vendor credit GL entries.
    const ledgerEntries = this.getVendorCreditGLEntries(
      vendorCredit,
      APAccount.id,
      purchaseDiscountAccount.id,
      otherExpensesAccount.id
    );
    const ledger = new Ledger(ledgerEntries);

    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Edits vendor credit associated GL entries.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  public rewriteVendorCreditGLEntries = async (
    tenantId: number,
    vendorCreditId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the GL entries.
    await this.revertVendorCreditGLEntries(tenantId, vendorCreditId, trx);

    // Re-write the GL entries.
    await this.writeVendorCreditGLEntries(tenantId, vendorCreditId, trx);
  };
}
