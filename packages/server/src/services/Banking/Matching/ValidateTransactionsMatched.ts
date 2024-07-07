import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './types';

@Service()
export class ValidateTransactionMatched {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validate the given transaction whether is matched with bank transactions.
   * @param {number} tenantId
   * @param {string} referenceType - Transaction reference type.
   * @param {number} referenceId - Transaction reference id.
   * @returns {Promise<void>}
   */
  public async validateTransactionNoMatchLinking(
    tenantId: number,
    referenceType: string,
    referenceId: number,
    trx?: Knex.Transaction
  ) {
    const { MatchedBankTransaction } = this.tenancy.models(tenantId);

    const foundMatchedTransaction =
      await MatchedBankTransaction.query(trx).findOne({
        referenceType,
        referenceId,
      });
    if (foundMatchedTransaction) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED);
    }
  }
}
