import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { ServiceError } from '../../Items/ServiceError';
import { BankTransactionLine } from '../models/BankTransactionLine';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ValidateDeleteBankAccountTransactions {
  constructor(
    @Inject(BankTransactionLine.name)
    private readonly bankTransactionLineModel: TenantModelProxy<
      typeof BankTransactionLine
    >,
  ) {}

  /**
   * Validate the account has no associated cashflow transactions.
   * @param {number} accountId
   */
  public validateAccountHasNoCashflowEntries = async (accountId: number) => {
    const associatedLines = await this.bankTransactionLineModel()
      .query()
      .where('creditAccountId', accountId)
      .orWhere('cashflowAccountId', accountId);

    if (associatedLines.length > 0) {
      throw new ServiceError(ERRORS.ACCOUNT_HAS_ASSOCIATED_TRANSACTIONS);
    }
  };
}
