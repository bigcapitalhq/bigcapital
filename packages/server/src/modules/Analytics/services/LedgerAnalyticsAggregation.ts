import { ACCOUNT_TYPES, ACCOUNT_ROOT_TYPE } from '@/constants/accounts';
import {
  IAccountBalanceRow,
  OrgFinancialTotalsMap,
} from '../Analytics.constants';

export interface IAccountTypeMeta {
  rootType: string;
  normal: string;
}

const accountTypesMap = new Map<string, IAccountTypeMeta>(
  ACCOUNT_TYPES.map((type) => [
    type.key,
    { rootType: type.rootType, normal: type.normal },
  ]),
);

/**
 * Retrieve the metadata of the given account type key.
 * @param {string} accountType - The account type key (e.g. 'bank').
 * @returns {IAccountTypeMeta | undefined}
 */
export const getAccountTypeMeta = (
  accountType: string,
): IAccountTypeMeta | undefined => {
  return accountTypesMap.get(accountType);
};

/**
 * Retrieve the root types that are summarized in the workspaces
 * financial totals (asset and liability).
 */
export const ASSET_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(
  (t) => t.rootType === ACCOUNT_ROOT_TYPE.ASSET,
).map((t) => t.key);

export const LIABILITY_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(
  (t) => t.rootType === ACCOUNT_ROOT_TYPE.LIABILITY,
).map((t) => t.key);

/**
 * Compute the signed balance of an account transactions row
 * (same semantics as the balance sheet: debit-normal => debit - credit,
 * credit-normal => credit - debit).
 * @param {number} credit
 * @param {number} debit
 * @param {string} accountNormal
 * @returns {number}
 */
export const getSignedAmount = (
  credit: number,
  debit: number,
  accountNormal: string,
): number => {
  return accountNormal === 'credit' ? credit - debit : debit - credit;
};

/**
 * Aggregate the account balance rows into per-organization
 * total assets and total liabilities.
 * Inactive accounts and unknown account types are excluded.
 * @param {IAccountBalanceRow[]} rows
 * @returns {OrgFinancialTotalsMap}
 */
export const aggregateFinancialTotals = (
  rows: IAccountBalanceRow[],
): OrgFinancialTotalsMap => {
  const totals: OrgFinancialTotalsMap = new Map();

  rows.forEach((row) => {
    const typeMeta = accountTypesMap.get(row.accountType);
    if (!typeMeta) return;
    if (!row.active) return;

    if (
      typeMeta.rootType !== ACCOUNT_ROOT_TYPE.ASSET &&
      typeMeta.rootType !== ACCOUNT_ROOT_TYPE.LIABILITY
    ) {
      return;
    }

    const signed = getSignedAmount(row.credit, row.debit, row.accountNormal);

    const orgTotals = totals.get(row.organizationId) ?? {
      totalAssets: 0,
      totalLiabilities: 0,
    };

    if (typeMeta.rootType === ACCOUNT_ROOT_TYPE.ASSET) {
      orgTotals.totalAssets += signed;
    } else {
      orgTotals.totalLiabilities += signed;
    }

    totals.set(row.organizationId, orgTotals);
  });

  return totals;
};
