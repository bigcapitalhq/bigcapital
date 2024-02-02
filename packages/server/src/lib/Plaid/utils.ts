import * as R from 'ramda';
import { IAccountCreateDTO, ICashflowNewCommandDTO } from '@/interfaces';
import { PlaidAccount, PlaidTransaction } from './_types';

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
  };
};

export const transformPlaidTrxsToCashflowCreate = R.curry(
  (
    cashflowAccountId: number,
    creditAccountId: number,
    plaidTranasction: PlaidTransaction,
  ): ICashflowNewCommandDTO => {
    return {
      date: plaidTranasction.authorized_data,

      transactionType: '',
      description: '',

      amount: plaidTranasction.amount,
      exchangeRate: 1,
      currencyCode: plaidTranasction.iso_currency_code,
      creditAccountId,
      cashflowAccountId,

      // transactionNumber: string;
      // referenceNo: string;
    };
  }
);
