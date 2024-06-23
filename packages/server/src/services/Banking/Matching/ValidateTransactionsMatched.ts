import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './types';

@Service()
export class ValidateTransactionMatched {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   *
   * @param {number} tenantId
   * @param {string} referenceType
   * @param {number} referenceId
   */
  public async validateTransactionNoMatchLinking(
    tenantId: number,
    referenceType: string,
    referenceId: number
  ) {
    const { MatchedBankTransaction } = this.tenancy.models(tenantId);

    const foundMatchedTransaction =
      await MatchedBankTransaction.query().findOne({
        referenceType,
        referenceId,
      });
    if (foundMatchedTransaction) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_TRANSACTION_MATCHED);
    }
  }
}
