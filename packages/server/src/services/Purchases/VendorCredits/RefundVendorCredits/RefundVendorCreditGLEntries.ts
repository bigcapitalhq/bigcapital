import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { AccountNormal, ILedgerEntry } from '@/interfaces';
import { IRefundVendorCredit } from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import LedgerRepository from '@/services/Ledger/LedgerRepository';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class RefundVendorCreditGLEntries {
  @Inject()
  private journalService: JournalPosterService;

  @Inject()
  private ledgerRepository: LedgerRepository;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the refund credit common GL entry.
   * @param   {IRefundVendorCredit} refundCredit
   */
  private getRefundCreditGLCommonEntry = (
    refundCredit: IRefundVendorCredit
  ) => {
    return {
      exchangeRate: refundCredit.exchangeRate,
      currencyCode: refundCredit.currencyCode,

      transactionType: 'RefundVendorCredit',
      transactionId: refundCredit.id,

      date: refundCredit.date,
      userId: refundCredit.userId,
      referenceNumber: refundCredit.referenceNo,
      createdAt: refundCredit.createdAt,
      indexGroup: 10,

      credit: 0,
      debit: 0,

      note: refundCredit.description,
      branchId: refundCredit.branchId,
    };
  };

  /**
   * Retrieves the refund credit payable GL entry.
   * @param   {IRefundVendorCredit} refundCredit
   * @param   {number} APAccountId
   * @returns {ILedgerEntry}
   */
  private getRefundCreditGLPayableEntry = (
    refundCredit: IRefundVendorCredit,
    APAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getRefundCreditGLCommonEntry(refundCredit);

    return {
      ...commonEntry,
      credit: refundCredit.amount,
      accountId: APAccountId,
      contactId: refundCredit.vendorCredit.vendorId,
      index: 1,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieves the refund credit deposit GL entry.
   * @param   {IRefundVendorCredit} refundCredit
   * @returns {ILedgerEntry}
   */
  private getRefundCreditGLDepositEntry = (
    refundCredit: IRefundVendorCredit
  ): ILedgerEntry => {
    const commonEntry = this.getRefundCreditGLCommonEntry(refundCredit);

    return {
      ...commonEntry,
      debit: refundCredit.amount,
      accountId: refundCredit.depositAccountId,
      index: 2,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieve refund vendor credit GL entries.
   * @param {IRefundVendorCredit} refundCredit
   * @param {number} APAccountId
   * @returns {ILedgerEntry[]}
   */
  public getRefundCreditGLEntries = (
    refundCredit: IRefundVendorCredit,
    APAccountId: number
  ): ILedgerEntry[] => {
    const payableEntry = this.getRefundCreditGLPayableEntry(
      refundCredit,
      APAccountId
    );
    const depositEntry = this.getRefundCreditGLDepositEntry(refundCredit);

    return [payableEntry, depositEntry];
  };

  /**
   * Saves refund credit note GL entries.
   * @param {number} tenantId
   * @param {IRefundVendorCredit} refundCredit -
   * @param {Knex.Transaction} trx -
   * @return {Promise<void>}
   */
  public saveRefundCreditGLEntries = async (
    tenantId: number,
    refundCreditId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { Account, RefundVendorCredit } = this.tenancy.models(tenantId);

    // Retireve refund with associated vendor credit entity.
    const refundCredit = await RefundVendorCredit.query()
      .findById(refundCreditId)
      .withGraphFetched('vendorCredit');

    const payableAccount = await Account.query().findOne(
      'slug',
      'accounts-payable'
    );
    // Generates the GL entries of the given refund credit.
    const entries = this.getRefundCreditGLEntries(
      refundCredit,
      payableAccount.id
    );
    // Saves the ledger to the storage.
    await this.ledgerRepository.saveLedgerEntries(tenantId, entries, trx);
  };

  /**
   * Reverts refund credit note GL entries.
   * @param {number} tenantId
   * @param {number} refundCreditId
   * @param {Knex.Transaction} trx
   * @return {Promise<void>}
   */
  public revertRefundCreditGLEntries = async (
    tenantId: number,
    refundCreditId: number,
    trx?: Knex.Transaction
  ) => {
    await this.journalService.revertJournalTransactions(
      tenantId,
      refundCreditId,
      'RefundVendorCredit',
      trx
    );
  };
}
