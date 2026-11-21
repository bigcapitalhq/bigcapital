import { ACCOUNT_TYPE } from '@/constants/accounts';
import type { Account } from '@/modules/Accounts/models/Account.model';
import { ERRORS } from './constants';

export function getReconciliationSupport(
  account: Pick<Account, 'accountType' | 'currencyCode'>,
  baseCurrency?: string,
) {
  if (account.accountType !== ACCOUNT_TYPE.BANK) {
    return {
      isSupported: false,
      errorCode: ERRORS.BANK_RECONCILIATION_ACCOUNT_INVALID,
      unsupportedReason: 'Reconciliation is only available for bank accounts.',
    };
  }
  if (baseCurrency && account.currencyCode !== baseCurrency) {
    return {
      isSupported: false,
      errorCode: ERRORS.BANK_RECONCILIATION_FOREIGN_CURRENCY_NOT_SUPPORTED,
      unsupportedReason:
        'Reconciliation is not supported for foreign currency accounts yet.',
    };
  }
  return { isSupported: true, errorCode: null, unsupportedReason: null };
}
