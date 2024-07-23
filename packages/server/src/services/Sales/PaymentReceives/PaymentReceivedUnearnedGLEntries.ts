import * as R from 'ramda';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { flatten } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';
import { PaymentReceivedGLCommon } from './PaymentReceivedGLCommon';
import {
  AccountNormal,
  ILedgerEntry,
  IPaymentReceive,
  IPaymentReceiveEntry,
} from '@/interfaces';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class PaymentReceivedUnearnedGLEntries extends PaymentReceivedGLCommon {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Writes payment GL entries to the storage.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public writePaymentGLEntries = async (
    tenantId: number,
    paymentReceiveId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieves the payment receive with associated entries.
    const paymentReceive = await PaymentReceive.query(trx)
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

    // Stop early if
    if (!paymentReceive.unearnedRevenueAccountId) {
      return;
    }
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    const ledger = await this.getPaymentReceiveGLedger(
      tenantId,
      paymentReceive
    );
    // Commit the ledger entries to the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Rewrites the given payment receive GL entries.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentGLEntries = async (
    tenantId: number,
    paymentReceiveId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the payment GL entries.
    await this.revertPaymentGLEntries(tenantId, paymentReceiveId, trx);

    // Writes the payment GL entries.
    await this.writePaymentGLEntries(tenantId, paymentReceiveId, trx);
  };

  /**
   * Retrieves the payment received GL entries.
   * @param {number} tenantId
   * @param {IPaymentReceive} paymentReceive
   * @returns {Promise<Ledger>}
   */
  private getPaymentReceiveGLedger = async (
    tenantId: number,
    paymentReceive: IPaymentReceive
  ) => {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the A/R account of the given currency.
    const receivableAccount =
      await accountRepository.findOrCreateAccountReceivable(
        paymentReceive.currencyCode
      );
    // Retrieve the payment GL entries.
    const entries = this.getPaymentGLEntries(
      receivableAccount.id,
      paymentReceive
    );
    const unearnedRevenueEntries =
      this.getUnearnedRevenueEntries(paymentReceive);

    const combinedEntries = [...unearnedRevenueEntries, ...entries];

    return new Ledger(combinedEntries);
  };

  /**
   * Retrieve the payment received GL entries.
   * @param {number} ARAccountId - A/R account id.
   * @param {IPaymentReceive} paymentReceive -
   * @returns {Array<ILedgerEntry>}
   */
  private getPaymentGLEntries = R.curry(
    (
      ARAccountId: number,
      paymentReceive: IPaymentReceive
    ): Array<ILedgerEntry> => {
      const getPaymentEntryGLEntries = this.getPaymentEntryGLEntries(
        ARAccountId,
        paymentReceive
      );
      const entriesGroup = paymentReceive.entries.map((paymentEntry) => {
        return getPaymentEntryGLEntries(paymentEntry);
      });
      return flatten(entriesGroup);
    }
  );

  /**
   * Retrieve the payment entry GL entries.
   * @param {IPaymentReceiveEntry} paymentReceivedEntry -
   * @param {IPaymentReceive} paymentReceive -
   * @returns {Array<ILedgerEntry>}
   */
  private getPaymentEntryGLEntries = R.curry(
    (
      ARAccountId: number,
      paymentReceive: IPaymentReceive,
      paymentReceivedEntry: IPaymentReceiveEntry
    ): Array<ILedgerEntry> => {
      const unearnedRevenueEntry = this.getDebitUnearnedRevenueGLEntry(
        paymentReceivedEntry.paymentAmount,
        paymentReceive
      );
      const AREntry = this.getPaymentReceivableEntry(
        paymentReceivedEntry.paymentAmount,
        paymentReceive,
        ARAccountId
      );
      return [unearnedRevenueEntry, AREntry];
    }
  );

  /**
   * Retrieves the payment deposit GL entry.
   * @param {IPaymentReceive} paymentReceive
   * @returns {ILedgerEntry}
   */
  private getDebitUnearnedRevenueGLEntry = (
    amount: number,
    paymentReceive: IPaymentReceive
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      debit: amount,
      accountId: paymentReceive.unearnedRevenueAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 2,
      indexGroup: 20,
    };
  };

  /**
   * Retrieves the payment receivable entry.
   * @param {IPaymentReceive} paymentReceive
   * @param {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getPaymentReceivableEntry = (
    amount: number,
    paymentReceive: IPaymentReceive,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      credit: amount,
      contactId: paymentReceive.customerId,
      accountId: ARAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 20,
    };
  };

  /**
   * Retrieves the unearned revenue entries.
   * @param {IPaymentReceive} paymentReceived -
   * @returns {Array<ILedgerEntry>}
   */
  private getUnearnedRevenueEntries = (
    paymentReceive: IPaymentReceive
  ): Array<ILedgerEntry> => {
    const depositEntry = this.getDepositPaymentGLEntry(paymentReceive);
    const unearnedEntry = this.getUnearnedRevenueEntry(paymentReceive);

    return [depositEntry, unearnedEntry];
  };

  /**
   * Retrieve the payment deposit entry.
   * @param {IPaymentReceive} paymentReceived -
   * @returns {ILedgerEntry}
   */
  private getDepositPaymentGLEntry = (
    paymentReceive: IPaymentReceive
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      debit: paymentReceive.amount,
      accountId: paymentReceive.depositAccountId,
      accountNormal: AccountNormal.DEBIT,
      indexGroup: 10,
      index: 1,
    };
  };

  /**
   * Retrieve the unearned revenue entry.
   * @param {IPaymentReceive} paymentReceived -
   * @returns {ILedgerEntry}
   */
  private getUnearnedRevenueEntry = (
    paymentReceived: IPaymentReceive
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceived);

    return {
      ...commonJournal,
      credit: paymentReceived.amount,
      accountId: paymentReceived.unearnedRevenueAccountId,
      accountNormal: AccountNormal.CREDIT,
      indexGroup: 10,
      index: 1,
    };
  };
}
