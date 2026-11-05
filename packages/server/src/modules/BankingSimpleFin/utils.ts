import * as moment from 'moment';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { IAccountCreateDTO } from '@/interfaces/Account';
import { CreateUncategorizedTransactionDTO } from '../BankingCategorize/types/BankingCategorize.types';
import {
  SimpleFinAccount,
  SimpleFinClaimedAccount,
  SimpleFinTransaction,
} from './types/BankingSimpleFin.types';

/**
 * The maximum length of the uncategorized transaction `varchar` columns
 * (`payee` and `reference_no`).
 */
const UNCATEGORIZED_TRANSACTION_VARCHAR_MAX_LENGTH = 255;

/**
 * Decodes a SimpleFIN setup token (base64 of the claim URL) to the claim URL.
 * Returns `null` when the token does not decode to a valid http(s) URL.
 * @param {string} setupToken
 * @returns {string|null}
 */
export const decodeSimpleFinSetupToken = (
  setupToken: string,
): string | null => {
  if (typeof setupToken !== 'string') return null;

  const normalized = setupToken.trim();
  if (!normalized) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(normalized, 'base64').toString('utf8').trim();
  } catch {
    return null;
  }
  try {
    const url = new URL(decoded);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Splits a SimpleFIN access URL into the base URL and the basic auth credentials.
 * @param {string} accessUrl - e.g. https://user:pass@bridge.simplefin.org/simplefin
 */
export const parseSimpleFinAccessUrl = (
  accessUrl: string,
): { baseUrl: string; username: string; password: string } => {
  const url = new URL(accessUrl.trim());
  const username = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);

  url.username = '';
  url.password = '';

  // Strip the trailing slash so endpoints can be appended safely.
  const baseUrl = url.toString().replace(/\/+$/, '');

  return { baseUrl, username, password };
};

/**
 * Converts a unix epoch (seconds) timestamp to a `YYYY-MM-DD` date string.
 * @param {number} epochSeconds
 * @returns {string|null}
 */
export const simpleFinEpochToDate = (
  epochSeconds: number | undefined | null,
): string | null => {
  if (!epochSeconds || !Number.isFinite(epochSeconds)) return null;
  return moment.unix(epochSeconds).utc().format('YYYY-MM-DD');
};

/**
 * Parses a SimpleFIN numeric string amount.
 * @param {string|number} amount
 * @returns {number}
 */
export const parseSimpleFinAmount = (amount: string | number): number => {
  const parsed = typeof amount === 'number' ? amount : parseFloat(amount);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * SimpleFIN currencies are ISO 4217 codes, or a URL for custom currencies.
 * Returns the ISO code when valid, otherwise `null`.
 * @param {string} currency
 * @returns {string|null}
 */
export const normalizeSimpleFinCurrency = (
  currency: string | undefined,
): string | null => {
  if (!currency) return null;
  const upper = currency.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(upper) ? upper : null;
};

/**
 * Truncates the given value to the maximum length allowed by the
 * uncategorized transaction `varchar` columns.
 * @param {string|null|undefined} value
 * @returns {string|undefined}
 */
const truncateTransactionString = (
  value: string | null | undefined,
): string | undefined => {
  if (value === null || value === undefined) return;

  // Slice by code points instead of UTF-16 code units to avoid splitting
  // multi-byte characters.
  return Array.from(value)
    .slice(0, UNCATEGORIZED_TRANSACTION_VARCHAR_MAX_LENGTH)
    .join('');
};

/**
 * Transforms a SimpleFIN account to the claim response shape shown to the
 * user when picking which accounts to link.
 * @param {SimpleFinAccount} account
 * @returns {SimpleFinClaimedAccount}
 */
export const transformSimpleFinAccountToClaimed = (
  account: SimpleFinAccount,
): SimpleFinClaimedAccount => {
  return {
    id: account.id,
    name: account.name,
    currency: account.currency,
    balance: parseSimpleFinAmount(account.balance),
    availableBalance:
      account['available-balance'] !== undefined
        ? parseSimpleFinAmount(account['available-balance'])
        : null,
    balanceDate: simpleFinEpochToDate(account['balance-date']),
    connectionName: account.org?.name || account.org?.domain || '',
  };
};

/**
 * Transforms a SimpleFIN account to a create account DTO.
 * @param {string} simplefinItemId - The SimpleFIN item id.
 * @param {string} accountType - The system account type (bank or credit-card).
 * @param {string} baseCurrency - The tenant base currency as a fallback.
 * @param {SimpleFinAccount} account - The SimpleFIN account.
 * @returns {IAccountCreateDTO}
 */
export const transformSimpleFinAccountToCreateAccount = (
  simplefinItemId: string,
  accountType: string,
  baseCurrency: string,
  account: SimpleFinAccount,
): IAccountCreateDTO => {
  const connectionName = account.org?.name || account.org?.domain;
  const name = connectionName
    ? `${connectionName} - ${account.name}`
    : account.name;

  return {
    name,
    code: '',
    description: '',
    currencyCode: normalizeSimpleFinCurrency(account.currency) || baseCurrency,
    accountType:
      accountType === ACCOUNT_TYPE.CREDIT_CARD
        ? ACCOUNT_TYPE.CREDIT_CARD
        : ACCOUNT_TYPE.BANK,
    active: true,
    bankBalance: parseSimpleFinAmount(account.balance),
    simplefinAccountId: account.id,
    simplefinItemId,
  };
};

/**
 * Transforms a SimpleFIN transaction to an uncategorized bank transaction DTO.
 * @param {number} cashflowAccountId - The system account id.
 * @param {string} currencyCode - The system account currency code.
 * @param {SimpleFinTransaction} transaction - The SimpleFIN transaction.
 * @returns {CreateUncategorizedTransactionDTO}
 */
export const transformSimpleFinTrxToCashflowCreate = (
  cashflowAccountId: number,
  currencyCode: string,
  transaction: SimpleFinTransaction,
): CreateUncategorizedTransactionDTO => {
  // Pending transactions may carry a zero `posted` timestamp.
  const date =
    simpleFinEpochToDate(transaction.posted) ||
    simpleFinEpochToDate(transaction.transacted_at) ||
    moment().utc().format('YYYY-MM-DD');

  const description = transaction.description || transaction.memo || undefined;

  return {
    date,
    // SimpleFIN: positive amounts are deposits, negative are withdrawals,
    // which matches the uncategorized transaction sign convention.
    amount: parseSimpleFinAmount(transaction.amount),
    description,
    payee: truncateTransactionString(transaction.payee || undefined),
    currencyCode,
    accountId: cashflowAccountId,
    simplefinTransactionId: transaction.id,
    pending: !!transaction.pending,
  };
};
