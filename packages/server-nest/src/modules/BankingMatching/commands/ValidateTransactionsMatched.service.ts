import { Knex } from 'knex';
import { ERRORS } from '../types';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { MatchedBankTransaction } from '../models/MatchedBankTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ValidateTransactionMatched {
  constructor(
    @Inject(MatchedBankTransaction.name)
    private readonly matchedBankTransactionModel: TenantModelProxy<
      typeof MatchedBankTransaction
    >,
  ) {}

  /**
   * Validate the given transaction whether is matched with bank transactions.
   * @param {string} referenceType - Transaction reference type.
   * @param {number} referenceId - Transaction reference id.
   * @returns {Promise<void>}
   */
  public async validateTransactionNoMatchLinking(
    referenceType: string,
    referenceId: number,
    trx?: Knex.Transaction,
  ) {
    const foundMatchedTransaction = await this.matchedBankTransactionModel()
      .query(trx)
      .findOne({
        referenceType,
        referenceId,
      });

    if (foundMatchedTransaction) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED);
    }
  }
}
