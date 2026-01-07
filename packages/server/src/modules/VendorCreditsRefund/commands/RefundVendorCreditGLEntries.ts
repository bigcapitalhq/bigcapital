import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Inject, Injectable } from '@nestjs/common';
import { RefundVendorCredit } from '../models/RefundVendorCredit';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';

@Injectable()
export class RefundVendorCreditGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(RefundVendorCredit.name)
    private readonly refundVendorCreditModel: TenantModelProxy<
      typeof RefundVendorCredit
    >,
  ) { }

  /**
   * Retrieves the refund vendor credit common GL entry.
   * @param {RefundVendorCredit} refundVendorCredit
   * @returns
   */
  private getRefundVendorCreditCommonGLEntry = (
    refundVendorCredit: RefundVendorCredit,
  ) => {
    const model = refundVendorCredit as any;
    return {
      currencyCode: refundVendorCredit.currencyCode,
      exchangeRate: refundVendorCredit.exchangeRate,

      transactionType: 'RefundVendorCredit',
      transactionId: refundVendorCredit.id,
      date: refundVendorCredit.date,
      userId: refundVendorCredit.vendorCredit?.userId,

      referenceNumber: refundVendorCredit.referenceNo,

      createdAt: model.createdAt,
      indexGroup: 10,

      credit: 0,
      debit: 0,

      note: refundVendorCredit.description,
      branchId: refundVendorCredit.branchId,
    };
  };

  /**
   * Retrieves the refund vendor credit payable GL entry.
   * @param   {RefundVendorCredit} refundVendorCredit
   * @param   {number} APAccountId
   * @returns {ILedgerEntry}
   */
  private getRefundVendorCreditGLPayableEntry = (
    refundVendorCredit: RefundVendorCredit,
    APAccountId: number,
  ): ILedgerEntry => {
    const commonEntry = this.getRefundVendorCreditCommonGLEntry(
      refundVendorCredit,
    );

    return {
      ...commonEntry,
      credit: refundVendorCredit.amount,
      accountId: APAccountId,
      contactId: refundVendorCredit.vendorCredit.vendorId,
      index: 1,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieves the refund vendor credit deposit GL entry.
   * @param   {RefundVendorCredit} refundVendorCredit
   * @returns {ILedgerEntry}
   */
  private getRefundVendorCreditGLDepositEntry = (
    refundVendorCredit: RefundVendorCredit,
  ): ILedgerEntry => {
    const commonEntry = this.getRefundVendorCreditCommonGLEntry(
      refundVendorCredit,
    );

    return {
      ...commonEntry,
      debit: refundVendorCredit.amount,
      accountId: refundVendorCredit.depositAccountId,
      index: 2,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieve refund vendor credit GL entries.
   * @param {RefundVendorCredit} refundVendorCredit
   * @param {number} APAccountId
   * @returns {ILedgerEntry[]}
   */
  public getRefundVendorCreditGLEntries(
    refundVendorCredit: RefundVendorCredit,
    APAccountId: number,
  ): ILedgerEntry[] {
    const payableEntry = this.getRefundVendorCreditGLPayableEntry(
      refundVendorCredit,
      APAccountId,
    );
    const depositEntry = this.getRefundVendorCreditGLDepositEntry(
      refundVendorCredit,
    );

    return [payableEntry, depositEntry];
  }

  /**
   * Creates refund vendor credit GL entries.
   * @param {number} refundVendorCreditId
   * @param {Knex.Transaction} trx
   */
  public createRefundVendorCreditGLEntries = async (
    refundVendorCreditId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieve the refund with associated vendor credit.
    const refundVendorCredit = await this.refundVendorCreditModel()
      .query(trx)
      .findById(refundVendorCreditId)
      .withGraphFetched('vendorCredit');

    // Retrieve the payable account (A/P) account based on the given currency.
    const APAccount = await this.accountRepository.findOrCreateAccountsPayable(
      refundVendorCredit.currencyCode,
      {},
      trx,
    );

    // Retrieve refund vendor credit GL entries.
    const refundGLEntries = this.getRefundVendorCreditGLEntries(
      refundVendorCredit,
      APAccount.id,
    );
    const ledger = new Ledger(refundGLEntries);

    // Saves refund ledger entries.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts refund vendor credit GL entries.
   * @param {number} refundVendorCreditId
   * @param {Knex.Transaction} trx
   */
  public revertRefundVendorCreditGLEntries = async (
    refundVendorCreditId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      refundVendorCreditId,
      'RefundVendorCredit',
      trx,
    );
  };
}
