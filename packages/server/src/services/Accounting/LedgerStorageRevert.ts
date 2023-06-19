import { Inject } from 'typedi';
import { castArray } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import LedgerStorageService from './LedgerStorageService';
import Ledger from './Ledger';
import { Knex } from 'knex';

export class LedgerRevert {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Reverts the journal entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   */
  public getTransactionsByReference = async (
    tenantId: number,
    referenceId: number | number[],
    referenceType: string | string[]
  ) => {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const transactions = await AccountTransaction.query()
      .whereIn('reference_type', castArray(referenceType))
      .whereIn('reference_id', castArray(referenceId))
      .withGraphFetched('account');

    return transactions;
  };

  /**
   *
   * @param tenantId
   * @param referenceId
   * @param referenceType
   * @param trx
   */
  public revertGLEntries = async (
    tenantId: number,
    referenceId: number | number[],
    referenceType: string | string[],
    trx?: Knex.Transaction
  ) => {
    //
    const transactions = await this.getTransactionsByReference(
      tenantId,
      referenceId,
      referenceType
    );
    // Creates a new ledger from transaction and reverse the entries.
    const ledger = Ledger.fromTransactions(transactions);
    const reversedLedger = ledger.reverse();

    //
    await this.ledgerStorage.commit(tenantId, reversedLedger, trx);
  };
}
