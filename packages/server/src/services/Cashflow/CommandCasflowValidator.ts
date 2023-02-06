import { Service, Inject } from 'typedi';
import { includes, difference, camelCase, upperFirst } from 'lodash';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { IAccount, ICashflowTransactionLine } from '@/interfaces';
import { getCashflowTransactionType } from './utils';
import { ServiceError } from '@/exceptions';
import { CASHFLOW_TRANSACTION_TYPE, ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class CommandCashflowValidator {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the lines accounts type should be cash or bank account.
   * @param {IAccount} accounts -
   */
  public validateCreditAccountWithCashflowType = (
    creditAccount: IAccount,
    cashflowTransactionType: CASHFLOW_TRANSACTION_TYPE
  ): void => {
    const transactionTypeMeta = getCashflowTransactionType(
      cashflowTransactionType
    );
    const noneCashflowAccount = !includes(
      transactionTypeMeta.creditType,
      creditAccount.accountType
    );
    if (noneCashflowAccount) {
      throw new ServiceError(ERRORS.CREDIT_ACCOUNTS_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates the cashflow transaction type.
   * @param   {string} transactionType
   * @returns {string}
   */
  public validateCashflowTransactionType = (transactionType: string) => {
    const transformedType = upperFirst(
      camelCase(transactionType)
    ) as CASHFLOW_TRANSACTION_TYPE;

    // Retrieve the given transaction type meta.
    const transactionTypeMeta = getCashflowTransactionType(transformedType);

    // Throw service error in case not the found the given transaction type.
    if (!transactionTypeMeta) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_TYPE_INVALID);
    }
    return transformedType;
  };
}
