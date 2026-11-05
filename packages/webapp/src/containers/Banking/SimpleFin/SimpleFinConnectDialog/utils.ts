import intl from 'react-intl-universal';
import type { SimpleFinClaimedAccount } from '@bigcapital/sdk-ts';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

export type SimpleFinLinkableAccountType = 'bank' | 'credit-card';

export interface SimpleFinAccountSelection {
  account: SimpleFinClaimedAccount;
  selected: boolean;
  accountType: SimpleFinLinkableAccountType;
}

/**
 * Builds the initial per-account selection state. Every account starts
 * selected; accounts carrying a negative balance are most likely credit
 * cards, so default them to that type.
 */
export const buildInitialSelections = (
  accounts: SimpleFinClaimedAccount[],
): SimpleFinAccountSelection[] =>
  accounts.map((account) => ({
    account,
    selected: true,
    accountType:
      account.balance < 0
        ? (ACCOUNT_TYPE.CREDIT_CARD as SimpleFinLinkableAccountType)
        : (ACCOUNT_TYPE.BANK as SimpleFinLinkableAccountType),
  }));

/**
 * Extracts a user-facing message from an SDK/API error, falling back to the
 * given default message.
 */
export const getSimpleFinErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const data = (
    error as { data?: { errors?: Array<{ type?: string; message?: string }> } }
  )?.data;
  const first = data?.errors?.[0];

  if (!first) return fallback;

  switch (first.type) {
    case 'SIMPLEFIN_SETUP_TOKEN_INVALID':
      return intl.get('simplefin.error.setup_token_invalid');
    case 'SIMPLEFIN_SETUP_TOKEN_REJECTED':
      return intl.get('simplefin.error.setup_token_rejected');
    case 'SIMPLEFIN_PAYMENT_REQUIRED':
      return intl.get('simplefin.error.payment_required');
    case 'SIMPLEFIN_ACCESS_FORBIDDEN':
      return intl.get('simplefin.error.access_forbidden');
    case 'SIMPLEFIN_DISABLED':
      return intl.get('simplefin.error.disabled');
    case 'SIMPLEFIN_ACCOUNT_ALREADY_LINKED':
      return intl.get('simplefin.error.account_already_linked');
    default:
      return first.message || fallback;
  }
};
