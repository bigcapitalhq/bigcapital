import * as R from 'ramda';
import { Knex } from 'knex';
import {
  ISaleInvoice,
  IItemEntry,
  ILedgerEntry,
  AccountNormal,
  ILedger,
} from '@/interfaces';
import { Service, Inject } from 'typedi';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';

@Service()
export class SaleInvoiceGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledegrRepository: LedgerStorageService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  /**
   * Writes a sale invoice GL entries.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx
   */
  public writeInvoiceGLEntries = async (
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const saleInvoice = await SaleInvoice.query(trx)
      .findById(saleInvoiceId)
      .withGraphFetched('entries.item');

    // Find or create the A/R account.
    const ARAccount = await accountRepository.findOrCreateAccountReceivable(
      saleInvoice.currencyCode,
      {},
      trx
    );
    // Find or create tax payable account.
    const taxPayableAccount = await accountRepository.findOrCreateTaxPayable(
      {},
      trx
    );
    // Find or create the discount expense account.
    const discountAccount = await accountRepository.findOrCreateDiscountAccount(
      {},
      trx
    );
    // Find or create the other charges account.
    const otherChargesAccount =
      await accountRepository.findOrCreateOtherChargesAccount({}, trx);

    // Retrieves the ledger of the invoice.
    const ledger = this.getInvoiceGLedger(
      saleInvoice,
      ARAccount.id,
      taxPayableAccount.id,
      discountAccount.id,
      otherChargesAccount.id
    );
    // Commits the ledger entries to the storage as UOW.
    await this.ledegrRepository.commit(tenantId, ledger, trx);
  };

  /**
   * Rewrites the given invoice GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {Knex.Transaction} trx
   */
  public rewritesInvoiceGLEntries = async (
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the invoice GL entries.
    await this.revertInvoiceGLEntries(tenantId, saleInvoiceId, trx);

    // Writes the invoice GL entries.
    await this.writeInvoiceGLEntries(tenantId, saleInvoiceId, trx);
  };

  /**
   * Reverts the given invoice GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {Knex.Transaction} trx
   */
  public revertInvoiceGLEntries = async (
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledegrRepository.deleteByReference(
      tenantId,
      saleInvoiceId,
      'SaleInvoice',
      trx
    );
  };

  /**
   * Retrieves the given invoice ledger.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} ARAccountId
   * @returns {ILedger}
   */
  public getInvoiceGLedger = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number,
    taxPayableAccountId: number,
    discountAccountId: number,
    otherChargesAccountId: number
  ): ILedger => {
    const entries = this.getInvoiceGLEntries(
      saleInvoice,
      ARAccountId,
      taxPayableAccountId,
      discountAccountId,
      otherChargesAccountId
    );
    return new Ledger(entries);
  };

  /**
   * Retrieves the invoice GL common entry.
   * @param {ISaleInvoice} saleInvoice
   * @returns {Partial<ILedgerEntry>}
   */
  private getInvoiceGLCommonEntry = (
    saleInvoice: ISaleInvoice
  ): Partial<ILedgerEntry> => ({
    credit: 0,
    debit: 0,

    currencyCode: saleInvoice.currencyCode,
    exchangeRate: saleInvoice.exchangeRate,

    transactionType: 'SaleInvoice',
    transactionId: saleInvoice.id,

    date: saleInvoice.invoiceDate,
    userId: saleInvoice.userId,

    transactionNumber: saleInvoice.invoiceNo,
    referenceNumber: saleInvoice.referenceNo,

    createdAt: saleInvoice.createdAt,
    indexGroup: 10,

    branchId: saleInvoice.branchId,
  });

  /**
   * Retrieve receivable entry of the given invoice.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getInvoiceReceivableEntry = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);

    return {
      ...commonEntry,
      debit: saleInvoice.totalLocal,
      accountId: ARAccountId,
      contactId: saleInvoice.customerId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    } as ILedgerEntry;
  };

  /**
   * Retrieve item income entry of the given invoice.
   * @param {ISaleInvoice} saleInvoice -
   * @param {IItemEntry} entry -
   * @param {number} index -
   * @returns {ILedgerEntry}
   */
  private getInvoiceItemEntry = R.curry(
    (
      saleInvoice: ISaleInvoice,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);
      const localAmount = entry.totalExcludingTax * saleInvoice.exchangeRate;

      return {
        ...commonEntry,
        credit: localAmount,
        accountId: entry.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountNormal: AccountNormal.CREDIT,
        projectId: entry.projectId || saleInvoice.projectId,
        taxRateId: entry.taxRateId,
        taxRate: entry.taxRate,
      };
    }
  );

  /**
   * Retreives the GL entry of tax payable.
   * @param {ISaleInvoice} saleInvoice -
   * @param {number} taxPayableAccountId -
   * @returns {ILedgerEntry}
   */
  private getInvoiceTaxEntry = R.curry(
    (
      saleInvoice: ISaleInvoice,
      taxPayableAccountId: number,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);

      return {
        ...commonEntry,
        credit: entry.taxAmount,
        accountId: taxPayableAccountId,
        index: index + 1,
        indexGroup: 30,
        accountNormal: AccountNormal.CREDIT,
        taxRateId: entry.taxRateId,
        taxRate: entry.taxRate,
      };
    }
  );

  /**
   * Retrieves the invoice tax GL entries.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} taxPayableAccountId
   * @returns {ILedgerEntry[]}
   */
  private getInvoiceTaxEntries = (
    saleInvoice: ISaleInvoice,
    taxPayableAccountId: number
  ): ILedgerEntry[] => {
    // Retrieves the non-zero tax entries.
    const nonZeroTaxEntries = this.itemsEntriesService.getNonZeroEntries(
      saleInvoice.entries
    );
    const transformTaxEntry = this.getInvoiceTaxEntry(
      saleInvoice,
      taxPayableAccountId
    );
    // Transforms the non-zero tax entries to GL entries.
    return nonZeroTaxEntries.map(transformTaxEntry);
  };

  /**
   * Retrieves the invoice discount GL entry.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} discountAccountId
   * @returns {ILedgerEntry}
   */
  private getInvoiceDiscountEntry = (
    saleInvoice: ISaleInvoice,
    discountAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);

    return {
      ...commonEntry,
      debit: saleInvoice.discountAmountLocal,
      accountId: discountAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    } as ILedgerEntry;
  };

  /**
   * Retrieves the invoice adjustment GL entry.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} adjustmentAccountId
   * @returns {ILedgerEntry}
   */
  private getAdjustmentEntry = (
    saleInvoice: ISaleInvoice,
    otherChargesAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);
    const adjustmentAmount = Math.abs(saleInvoice.adjustmentLocal);

    return {
      ...commonEntry,
      debit: saleInvoice.adjustmentLocal < 0 ? adjustmentAmount : 0,
      credit: saleInvoice.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: otherChargesAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the invoice GL entries.
   * @param {ISaleInvoice} saleInvoice
   * @param {number} ARAccountId
   * @returns {ILedgerEntry[]}
   */
  public getInvoiceGLEntries = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number,
    taxPayableAccountId: number,
    discountAccountId: number,
    otherChargesAccountId: number
  ): ILedgerEntry[] => {
    const receivableEntry = this.getInvoiceReceivableEntry(
      saleInvoice,
      ARAccountId
    );
    const transformItemEntry = this.getInvoiceItemEntry(saleInvoice);
    const creditEntries = saleInvoice.entries.map(transformItemEntry);

    const taxEntries = this.getInvoiceTaxEntries(
      saleInvoice,
      taxPayableAccountId
    );
    const discountEntry = this.getInvoiceDiscountEntry(
      saleInvoice,
      discountAccountId
    );
    const adjustmentEntry = this.getAdjustmentEntry(
      saleInvoice,
      otherChargesAccountId
    );
    return [
      receivableEntry,
      ...creditEntries,
      ...taxEntries,
      discountEntry,
      adjustmentEntry,
    ];
  };
}
