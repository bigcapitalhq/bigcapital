import * as R from 'ramda';
import {
  ISaleInvoice,
  IItemEntry,
  ILedgerEntry,
  AccountNormal,
  ILedger,
} from '@/interfaces';
import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class SaleInvoiceGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerRepository: LedgerStorageService;

  /**
   * Writes a sale invoice GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
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
      saleInvoice.currencyCode
    );
    // Retrieves the ledger of the invoice.
    const ledger = this.getInvoiceGLedger(saleInvoice, ARAccount.id);

    // Commits the ledger entries to the storage as UOW.
    await this.ledgerRepository.commit(tenantId, ledger, trx);
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
    await this.ledgerRepository.deleteByReference(
      tenantId,
      saleInvoiceId,
      'SaleInvoice',
      trx
    );
  };

  /**
   * Retrieves the given invoice ledger.
   * @param   {ISaleInvoice} saleInvoice
   * @param   {number} ARAccountId
   * @returns {ILedger}
   */
  public getInvoiceGLedger = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number
  ): ILedger => {
    const entries = this.getInvoiceGLEntries(saleInvoice, ARAccountId);

    return new Ledger(entries);
  };

  /**
   * Retrieves the invoice GL common entry.
   * @param   {ISaleInvoice} saleInvoice
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
   * @param   {ISaleInvoice} saleInvoice
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getInvoiceReceivableEntry = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);

    return {
      ...commonEntry,
      debit: saleInvoice.localAmount,
      accountId: ARAccountId,
      contactId: saleInvoice.customerId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    } as ILedgerEntry;
  };

  /**
   * Retrieve item income entry of the given invoice.
   * @param   {ISaleInvoice} saleInvoice -
   * @param   {IItemEntry} entry -
   * @param   {number} index -
   * @returns {ILedgerEntry}
   */
  private getInvoiceItemEntry = R.curry(
    (
      saleInvoice: ISaleInvoice,
      entry: IItemEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getInvoiceGLCommonEntry(saleInvoice);
      const localAmount = entry.amount * saleInvoice.exchangeRate;

      return {
        ...commonEntry,
        credit: localAmount,
        accountId: entry.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountNormal: AccountNormal.CREDIT,
        projectId: entry.projectId || saleInvoice.projectId
      };
    }
  );

  /**
   * Retrieves the invoice GL entries.
   * @param   {ISaleInvoice} saleInvoice
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry[]}
   */
  public getInvoiceGLEntries = (
    saleInvoice: ISaleInvoice,
    ARAccountId: number
  ): ILedgerEntry[] => {
    const receivableEntry = this.getInvoiceReceivableEntry(
      saleInvoice,
      ARAccountId
    );
    const transformItemEntry = this.getInvoiceItemEntry(saleInvoice);
    const creditEntries = saleInvoice.entries.map(transformItemEntry);

    return [receivableEntry, ...creditEntries];
  };
}
