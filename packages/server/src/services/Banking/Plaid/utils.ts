import * as R from 'ramda';
import {
  CreateUncategorizedTransactionDTO,
  IAccountCreateDTO,
  PlaidAccount,
  PlaidTransaction,
} from '@/interfaces';

/**
 * Transformes the Plaid account to create cashflow account DTO.
 * @param {PlaidAccount} plaidAccount
 * @returns {IAccountCreateDTO}
 */
export const transformPlaidAccountToCreateAccount = R.curry(
  (institution: any, plaidAccount: PlaidAccount): IAccountCreateDTO => {
    return {
      name: `${institution.name} - ${plaidAccount.name}`,
      code: '',
      description: plaidAccount.official_name,
      currencyCode: plaidAccount.balances.iso_currency_code,
      accountType: 'cash',
      active: true,
      plaidAccountId: plaidAccount.account_id,
      bankBalance: plaidAccount.balances.current,
      accountMask: plaidAccount.mask,
    };
  }
);

/**
 * Transformes the plaid transaction to cashflow create DTO.
 * @param {number} cashflowAccountId - Cashflow account ID.
 * @param {number} creditAccountId - Credit account ID.
 * @param {PlaidTransaction} plaidTranasction - Plaid transaction.
 * @returns {CreateUncategorizedTransactionDTO}
 */
export const transformPlaidTrxsToCashflowCreate = R.curry(
  (
    cashflowAccountId: number,
    creditAccountId: number,
    plaidTranasction: PlaidTransaction
  ): CreateUncategorizedTransactionDTO => {
    return {
      date: plaidTranasction.date,
      amount: plaidTranasction.amount,
      description: plaidTranasction.name,
      payee: plaidTranasction.payment_meta?.payee,
      currencyCode: plaidTranasction.iso_currency_code,
      accountId: cashflowAccountId,
      referenceNo: plaidTranasction.payment_meta?.reference_number,
      plaidTransactionId: plaidTranasction.transaction_id,
    };
  }
);
