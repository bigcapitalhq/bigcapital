// @ts-nocheck
import * as moment from 'moment';

export type SyntheticRow = {
  accountId: number;
  credit: number;
  debit: number;
  date: string; // YYYY-MM-DD
  branchId: number | null;
};

export type AggregatedRow = {
  accountId: number;
  credit: number;
  debit: number;
};

export type AggregatedPeriodRow = AggregatedRow & {
  date: string; // pre-formatted period bucket (YYYY, YYYY-MM, YYYY-MM-DD)
};

export const PERIOD_FORMAT = {
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
} as const;

const safeDivide = (numerator: number, denominator: number): number => {
  if (!denominator || !isFinite(denominator)) return 0;
  return numerator / denominator;
};

const inventoryAwareExpenseAccount = (line: any): number | null => {
  if (line.item && line.item.type === 'inventory') {
    return line.item.inventoryAccountId ?? null;
  }
  return line.costAccountId ?? null;
};

/**
 * Pro-rates a sale invoice's line revenue against a payment amount and emits
 * synthetic credit rows in base currency. Mirrors `InvoiceGL.getBillItemEntry`'s
 * amount/account choice scaled by `(paymentAmount / invoice.total)`.
 */
export const projectInvoice = (
  invoice: any,
  paymentAmount: number,
  date: string,
  branchId: number | null,
): SyntheticRow[] => {
  const total = Number(invoice.total) || 0;
  const share = safeDivide(paymentAmount, total);
  if (!share) return [];

  const exchangeRate = invoice.exchangeRate || 1;
  const rows: SyntheticRow[] = [];
  for (const line of invoice.entries || []) {
    if (!line.sellAccountId) continue;
    const baseAmount = (line.totalExcludingTax || 0) * exchangeRate * share;
    if (!baseAmount) continue;
    rows.push({
      accountId: line.sellAccountId,
      credit: baseAmount,
      debit: 0,
      date,
      branchId,
    });
  }
  return rows;
};

/**
 * Pro-rates a bill's line expense against a payment amount and emits
 * synthetic debit rows in base currency. Mirrors `BillsGL.getBillItemEntry`'s
 * inventory-aware account choice.
 */
export const projectBill = (
  bill: any,
  paymentAmount: number,
  date: string,
  branchId: number | null,
): SyntheticRow[] => {
  const total = Number(bill.total) || 0;
  const share = safeDivide(paymentAmount, total);
  if (!share) return [];

  const exchangeRate = bill.exchangeRate || 1;
  const rows: SyntheticRow[] = [];
  for (const line of bill.entries || []) {
    const accountId = inventoryAwareExpenseAccount(line);
    if (!accountId) continue;
    const baseAmount = (line.totalExcludingTax || 0) * exchangeRate * share;
    if (!baseAmount) continue;
    rows.push({
      accountId,
      credit: 0,
      debit: baseAmount,
      date,
      branchId,
    });
  }
  return rows;
};

/**
 * Pro-rates a refund payment against a credit note's lines and emits
 * synthetic debit rows on the original revenue accounts (reversing previously
 * recognized cash-basis revenue).
 */
export const projectCreditNote = (
  creditNote: any,
  refundAmount: number,
  date: string,
  branchId: number | null,
): SyntheticRow[] => {
  const total = Number(creditNote.total) || 0;
  const share = safeDivide(refundAmount, total);
  if (!share) return [];

  const exchangeRate = creditNote.exchangeRate || 1;
  const rows: SyntheticRow[] = [];
  for (const line of creditNote.entries || []) {
    if (!line.sellAccountId) continue;
    const baseAmount = (line.totalExcludingTax || 0) * exchangeRate * share;
    if (!baseAmount) continue;
    rows.push({
      accountId: line.sellAccountId,
      credit: 0,
      debit: baseAmount,
      date,
      branchId,
    });
  }
  return rows;
};

/**
 * Pro-rates a refund payment against a vendor credit's lines and emits
 * synthetic credit rows on the original expense accounts (reversing previously
 * recognized cash-basis expense).
 */
export const projectVendorCredit = (
  vendorCredit: any,
  refundAmount: number,
  date: string,
  branchId: number | null,
): SyntheticRow[] => {
  const total = Number(vendorCredit.total) || 0;
  const share = safeDivide(refundAmount, total);
  if (!share) return [];

  const exchangeRate = vendorCredit.exchangeRate || 1;
  const rows: SyntheticRow[] = [];
  for (const line of vendorCredit.entries || []) {
    const accountId = inventoryAwareExpenseAccount(line);
    if (!accountId) continue;
    const baseAmount = (line.totalExcludingTax || 0) * exchangeRate * share;
    if (!baseAmount) continue;
    rows.push({
      accountId,
      credit: baseAmount,
      debit: 0,
      date,
      branchId,
    });
  }
  return rows;
};

export const aggregateByAccount = (rows: SyntheticRow[]): AggregatedRow[] => {
  const map = new Map<number, AggregatedRow>();
  for (const row of rows) {
    const existing = map.get(row.accountId);
    if (existing) {
      existing.credit += row.credit;
      existing.debit += row.debit;
    } else {
      map.set(row.accountId, {
        accountId: row.accountId,
        credit: row.credit,
        debit: row.debit,
      });
    }
  }
  return Array.from(map.values());
};

export const aggregateByAccountAndPeriod = (
  rows: SyntheticRow[],
  format: string,
): AggregatedPeriodRow[] => {
  const map = new Map<string, AggregatedPeriodRow>();
  for (const row of rows) {
    const period = moment(row.date).format(format);
    const key = `${row.accountId}|${period}`;
    const existing = map.get(key);
    if (existing) {
      existing.credit += row.credit;
      existing.debit += row.debit;
    } else {
      map.set(key, {
        accountId: row.accountId,
        credit: row.credit,
        debit: row.debit,
        date: period,
      });
    }
  }
  return Array.from(map.values());
};
