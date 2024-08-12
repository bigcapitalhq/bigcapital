import * as R from 'ramda';
import {
  Item as PlaidItem,
  Institution as PlaidInstitution,
  AccountBase as PlaidAccount,
  TransactionBase as PlaidTransactionBase,
} from 'plaid';
import {
  CreateUncategorizedTransactionDTO,
  IAccountCreateDTO,
} from '@/interfaces';

/**
 * Transformes the Plaid account to create cashflow account DTO.
 * @param {PlaidItem} item -
 * @param {PlaidInstitution} institution -
 * @param {PlaidAccount} plaidAccount -
 * @returns {IAccountCreateDTO}
 */
export const transformPlaidAccountToCreateAccount = R.curry(
  (
    item: PlaidItem,
    institution: PlaidInstitution,
    plaidAccount: PlaidAccount
  ): IAccountCreateDTO => {
    return {
      name: `${institution.name} - ${plaidAccount.name}`,
      code: '',
      description: plaidAccount.official_name,
      currencyCode: plaidAccount.balances.iso_currency_code,
      accountType: 'cash',
      active: true,
      bankBalance: plaidAccount.balances.current,
      accountMask: plaidAccount.mask,
      plaidAccountId: plaidAccount.account_id,
      plaidItemId: item.item_id,
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
    plaidTranasction: PlaidTransactionBase
  ): CreateUncategorizedTransactionDTO => {
    return {
      date: plaidTranasction.date,

      // Plaid: Positive values when money moves out of the account; negative values
      // when money moves in. For example, debit card purchases are positive;
      // credit card payments, direct deposits, and refunds are negative.
      amount: -1 * plaidTranasction.amount,

      description: plaidTranasction.name,
      payee: plaidTranasction.payment_meta?.payee,
      currencyCode: plaidTranasction.iso_currency_code,
      accountId: cashflowAccountId,
      referenceNo: plaidTranasction.payment_meta?.reference_number,
      plaidTransactionId: plaidTranasction.transaction_id,
      pending: plaidTranasction.pending,
      pendingPlaidTransactionId: plaidTranasction.pending_transaction_id,
    };
  }
);
