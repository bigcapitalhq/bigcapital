import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { PaymentReceivedGLCommon } from './PaymentReceivedGLCommon';
import {
  AccountNormal,
  ILedgerEntry,
  IPaymentReceive,
  IPaymentReceiveEntry,
} from '@/interfaces';

@Service()
export class PaymentReceivedUnearnedGLEntries extends PaymentReceivedGLCommon {
  @Inject()
  private tenancy: HasTenancyService;

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

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Retrieves the payment receive with associated entries.
    const paymentReceive = await PaymentReceive.query(trx)
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

    if (paymentReceive.unearnedRevenueAccountId) {
      return;
    }
    
  };

  private getPaymentGLEntries = (paymentReceive: IPaymentReceive) => {};

  private getPaymentUnearnedGLEntries = R.curry(() => {});

  /**
   *
   * @param {IPaymentReceiveEntry} paymentReceivedEntry -
   * @param {IPaymentReceive} paymentReceive -
   */
  private getPaymentEntryGLEntries = R.curry(
    (
      paymentReceivedEntry: IPaymentReceiveEntry,
      paymentReceive: IPaymentReceive
    ) => {
      const depositEntry = this.getPaymentDepositGLEntry(
        paymentReceivedEntry.paymentAmount,
        paymentReceive
      );
    }
  );

  /**
   * Retrieves the payment deposit GL entry.
   * @param {IPaymentReceive} paymentReceive
   * @returns {ILedgerEntry}
   */
  private getPaymentDepositGLEntry = (
    amount: number,
    paymentReceive: IPaymentReceive
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      credit: amount,
      accountId: paymentReceive.unearnedRevenueAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 2,
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
      debit: amount,
      contactId: paymentReceive.customerId,
      accountId: ARAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    };
  };
}
