import * as R from 'ramda';
import {
  IAccountCreateDTO,
  ICashflowNewCommandDTO,
  PlaidAccount,
  PlaidTransaction,
} from '@/interfaces';

/**
 * Transformes the Plaid account to create cashflow account DTO.
 * @param {PlaidAccount} plaidAccount
 * @returns {IAccountCreateDTO}
 */
export const transformPlaidAccountToCreateAccount = (
  plaidAccount: PlaidAccount
): IAccountCreateDTO => {
  return {
    name: plaidAccount.name,
    code: '',
    description: plaidAccount.official_name,
    currencyCode: plaidAccount.balances.iso_currency_code,
    accountType: 'cash',
    active: true,
    plaidAccountId: plaidAccount.account_id,
    bankBalance: plaidAccount.balances.current,
    accountMask: plaidAccount.mask,
  };
};

/**
 * Transformes the plaid transaction to cashflow create DTO.
 * @param {number} cashflowAccountId - Cashflow account ID.
 * @param {number} creditAccountId - Credit account ID.
 * @param {PlaidTransaction} plaidTranasction - Plaid transaction.
 * @returns {ICashflowNewCommandDTO}
 */
export const transformPlaidTrxsToCashflowCreate = R.curry(
  (
    cashflowAccountId: number,
    creditAccountId: number,
    plaidTranasction: PlaidTransaction
  ): ICashflowNewCommandDTO => {
    return {
      date: plaidTranasction.date,

      transactionType: 'OwnerContribution',
      description: plaidTranasction.name,

      amount: plaidTranasction.amount,
      exchangeRate: 1,
      currencyCode: plaidTranasction.iso_currency_code,
      creditAccountId,
      cashflowAccountId,

      // transactionNumber: string;
      // referenceNo: string;
      plaidTransactionId: plaidTranasction.transaction_id,
      publish: true,
    };
  }
);
