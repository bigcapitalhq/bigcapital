/**
 * Links from overview panels to the existing reports, carrying the same
 * period and accounting basis so the report shows the numbers the panel did.
 */

interface ProfitLossLinkOptions {
  fromDate: string;
  toDate: string;
  basis: string;
  monthly?: boolean;
}

export function profitLossLink({
  fromDate,
  toDate,
  basis,
  monthly = false,
}: ProfitLossLinkOptions): string {
  const query = new URLSearchParams({ fromDate, toDate, basis });
  if (monthly) {
    query.set('displayColumnsType', 'date_periods');
    query.set('displayColumnsBy', 'month');
  }
  return `/financial-reports/profit-loss-sheet?${query.toString()}`;
}

export const RECEIVABLE_AGING_LINK =
  '/financial-reports/receivable-aging-summary';
export const PAYABLE_AGING_LINK = '/financial-reports/payable-aging-summary';
export const BANK_ACCOUNTS_LINK = '/cashflow-accounts';
export const TRANSACTIONS_LOCKING_LINK = '/transactions-locking';
export const NEW_INVOICE_LINK = '/invoices/new';

export const bankAccountLink = (accountId: number): string =>
  `/cashflow-accounts/${accountId}/transactions`;

export const BILLS_LINK = '/bills';

/** The general ledger for the period, where cash in and out comes from. */
export function generalLedgerLink(fromDate: string, toDate: string): string {
  const query = new URLSearchParams({ fromDate, toDate });
  return `/financial-reports/general-ledger?${query.toString()}`;
}

/** The account's uncategorized bank transactions, ready to categorize. */
export const categorizeLink = (accountId: number): string =>
  `${bankAccountLink(accountId)}?filter=uncategorized`;

interface ReportPeriod {
  fromDate: string;
  toDate: string;
  basis: string;
}

export function salesTaxLink({ fromDate, toDate, basis }: ReportPeriod) {
  const query = new URLSearchParams({ fromDate, toDate, basis });
  return `/financial-reports/sales-tax-liability-summary?${query.toString()}`;
}
