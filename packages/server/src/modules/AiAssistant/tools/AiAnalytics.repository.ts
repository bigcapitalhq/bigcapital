import { Knex } from 'knex';
import * as moment from 'moment';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { IDateRange } from '../utils/date-range';
import { percentage, round, toNumber } from '../utils/number';
import {
  ICashPositionResult,
  ICustomerProfitability,
  ICustomerProfitRow,
  IFinancialSummary,
  IInventoryLevelsResult,
  IItemPerformanceResult,
  IItemPerformanceRow,
  IProfitAndLossAccount,
  IProfitAndLossBreakdown,
  IReceivableRow,
  IReceivablesResult,
  IRecordMatch,
  ITopCustomersResult,
} from './AiAnalytics.types';

const QUERY_TIMEOUT_MS = 5000;

const INCOME_ACCOUNT_TYPES = "('income','other-income')";

const emptyFinancialSummary = (
  period: IDateRange,
  currency: string,
): IFinancialSummary => ({
  period,
  currency,
  revenue: 0,
  cogs: 0,
  grossProfit: 0,
  operatingExpenses: 0,
  netProfit: 0,
  grossMarginPct: 0,
  netMarginPct: 0,
  invoiceCount: 0,
  invoicedTotal: 0,
  averageInvoiceValue: 0,
});

const sortAndLimit = <T extends { amount: number }>(
  rows: T[],
  limit: number,
): T[] => {
  return rows
    .filter((row) => row.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, limit);
};

export class AiAnalyticsRepository {
  constructor(private readonly knex: Knex) {}

  private async query<T = Record<string, any>>(
    sql: string,
    bindings: any[] = [],
  ): Promise<T[]> {
    const [rows] = (await this.knex
      .raw(sql, bindings)
      .timeout(QUERY_TIMEOUT_MS)) as unknown as [T[], any];
    return rows ?? [];
  }

  private basisClause(): string {
    return '(at.basis IS NULL OR at.basis = ?)';
  }

  private clampLimit(limit?: number, defaultValue = 5, max = 25): number {
    const parsed = Number(limit);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return defaultValue;
    }
    return Math.min(Math.floor(parsed), max);
  }

  private normalizeIds(ids: number[]): number[] {
    return [
      ...new Set(
        ids
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    ].slice(0, 50);
  }

  private itemIdClause(ids: number[]): string {
    return ids.join(',');
  }

  /**
   * Returns the P&L-level totals for a period.
   */
  public async getFinancialSummary(
    period: IDateRange,
    currency: string,
    basis: AccountingBasis,
  ): Promise<IFinancialSummary> {
    const [ledger] = await this.query<{
      revenue: string;
      cogs: string;
      operating_expenses: string;
    }>(
      `SELECT
        COALESCE(SUM(CASE WHEN a.account_type IN ${INCOME_ACCOUNT_TYPES} THEN at.credit - at.debit ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN a.account_type = 'cost-of-goods-sold' THEN at.debit - at.credit ELSE 0 END), 0) AS cogs,
        COALESCE(SUM(CASE WHEN a.account_type IN ('expense','other-expense') THEN at.debit - at.credit ELSE 0 END), 0) AS operating_expenses
      FROM ACCOUNTS_TRANSACTIONS at
      INNER JOIN ACCOUNTS a ON a.id = at.account_id
      WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}`,
      [period.fromDate, period.toDate, basis],
    );

    const [invoices] = await this.query<{
      invoice_count: string;
      invoiced_total: string;
    }>(
      `SELECT
        COUNT(*) AS invoice_count,
        COALESCE(SUM(
          (
            COALESCE(si.balance, 0)
            - CASE WHEN si.discount_type = 'percentage'
                THEN COALESCE(si.balance, 0) * (COALESCE(si.discount, 0) / 100)
                ELSE COALESCE(si.discount, 0)
              END
            + COALESCE(si.adjustment, 0)
            + CASE WHEN si.is_inclusive_tax THEN 0 ELSE COALESCE(si.tax_amount_withheld, 0) END
          ) * COALESCE(si.exchange_rate, 1)
        ), 0) AS invoiced_total
      FROM SALES_INVOICES si
      WHERE si.invoice_date >= ? AND si.invoice_date <= ?
        AND si.delivered_at IS NOT NULL`,
      [period.fromDate, period.toDate],
    );

    if (!ledger) {
      return emptyFinancialSummary(period, currency);
    }

    const revenue = round(ledger.revenue);
    const cogs = round(ledger.cogs);
    const operatingExpenses = round(ledger.operating_expenses);
    const grossProfit = round(revenue - cogs);
    const netProfit = round(grossProfit - operatingExpenses);
    const invoiceCount = toNumber(invoices?.invoice_count);
    const invoicedTotal = round(invoices?.invoiced_total);

    return {
      period,
      currency,
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      grossMarginPct: percentage(grossProfit, revenue),
      netMarginPct: percentage(netProfit, revenue),
      invoiceCount,
      invoicedTotal,
      averageInvoiceValue:
        invoiceCount > 0 ? round(invoicedTotal / invoiceCount) : 0,
    };
  }

  /**
   * Returns the largest income and expense accounts for a period.
   */
  public async getProfitAndLossBreakdown(
    period: IDateRange,
    currency: string,
    basis: AccountingBasis,
  ): Promise<IProfitAndLossBreakdown> {
    const rows = await this.query<{
      account_id: number;
      name: string;
      account_type: string;
      credit: string;
      debit: string;
    }>(
      `SELECT
        a.id AS account_id,
        a.name AS name,
        a.account_type AS account_type,
        COALESCE(SUM(at.credit), 0) AS credit,
        COALESCE(SUM(at.debit), 0) AS debit
      FROM ACCOUNTS_TRANSACTIONS at
      INNER JOIN ACCOUNTS a ON a.id = at.account_id
      WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}
        AND a.account_type IN ('income','other-income','cost-of-goods-sold','expense','other-expense')
      GROUP BY a.id, a.name, a.account_type`,
      [period.fromDate, period.toDate, basis],
    );

    const mapped: Array<IProfitAndLossAccount & { type: string }> = rows.map(
      (row) => {
        const isIncome = ['income', 'other-income'].includes(row.account_type);
        const amount = isIncome
          ? round(toNumber(row.credit) - toNumber(row.debit))
          : round(toNumber(row.debit) - toNumber(row.credit));

        return {
          accountId: Number(row.account_id),
          name: row.name,
          accountType: row.account_type,
          amount,
          percentage: 0,
          type: row.account_type,
        };
      },
    );

    const revenue = round(
      mapped
        .filter((row) => row.type === 'income' || row.type === 'other-income')
        .reduce((sum, row) => sum + row.amount, 0),
    );
    const cogs = round(
      mapped
        .filter((row) => row.type === 'cost-of-goods-sold')
        .reduce((sum, row) => sum + row.amount, 0),
    );
    const operatingExpenses = round(
      mapped
        .filter((row) => row.type === 'expense' || row.type === 'other-expense')
        .reduce((sum, row) => sum + row.amount, 0),
    );
    const grossProfit = round(revenue - cogs);
    const netProfit = round(grossProfit - operatingExpenses);

    const withPercentages = (items: IProfitAndLossAccount[]) =>
      items.map((item) => ({
        ...item,
        percentage: percentage(item.amount, revenue),
      }));

    return {
      period,
      currency,
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      income: withPercentages(
        sortAndLimit(
          mapped.filter(
            (row) => row.type === 'income' || row.type === 'other-income',
          ),
          10,
        ),
      ),
      costOfGoodsSold: withPercentages(
        sortAndLimit(
          mapped.filter((row) => row.type === 'cost-of-goods-sold'),
          10,
        ),
      ),
      expenses: withPercentages(
        sortAndLimit(
          mapped.filter(
            (row) => row.type === 'expense' || row.type === 'other-expense',
          ),
          10,
        ),
      ),
    };
  }

  /**
   * Ranks customers by gross profit for a period.
   */
  public async getTopCustomersByProfit(
    period: IDateRange,
    currency: string,
    basis: AccountingBasis,
    limit?: number,
  ): Promise<ITopCustomersResult> {
    const safeLimit = this.clampLimit(limit, 5, 25);
    const rows = await this.query<{
      customer_id: number;
      customer_name: string;
      revenue: string;
      cogs: string;
      invoice_count: string;
    }>(
      `SELECT * FROM (
        SELECT
          c.id AS customer_id,
          c.display_name AS customer_name,
          COALESCE(SUM(CASE WHEN a.account_type IN ${INCOME_ACCOUNT_TYPES} THEN at.credit - at.debit ELSE 0 END), 0) AS revenue,
          COALESCE(SUM(CASE WHEN at.costable = 1 THEN at.debit - at.credit ELSE 0 END), 0) AS cogs,
          COUNT(DISTINCT si.id) AS invoice_count
        FROM ACCOUNTS_TRANSACTIONS at
        INNER JOIN SALES_INVOICES si ON si.id = at.reference_id AND at.reference_type = 'SaleInvoice'
        INNER JOIN CONTACTS c ON c.id = si.customer_id AND c.contact_service = 'customer'
        INNER JOIN ACCOUNTS a ON a.id = at.account_id
        WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}
        GROUP BY c.id, c.display_name
      ) AS customer_profit
      WHERE revenue <> 0 OR cogs <> 0
      ORDER BY (revenue - cogs) DESC
      LIMIT ${safeLimit}`,
      [period.fromDate, period.toDate, basis],
    );

    const [totalsRow] = await this.query<{
      revenue: string;
      cogs: string;
    }>(
      `SELECT
        COALESCE(SUM(CASE WHEN a.account_type IN ${INCOME_ACCOUNT_TYPES} THEN at.credit - at.debit ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN at.costable = 1 THEN at.debit - at.credit ELSE 0 END), 0) AS cogs
      FROM ACCOUNTS_TRANSACTIONS at
      INNER JOIN SALES_INVOICES si ON si.id = at.reference_id AND at.reference_type = 'SaleInvoice'
      INNER JOIN CONTACTS c ON c.id = si.customer_id AND c.contact_service = 'customer'
      INNER JOIN ACCOUNTS a ON a.id = at.account_id
      WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}`,
      [period.fromDate, period.toDate, basis],
    );

    const customers = rows.map((row) => this.mapCustomerProfitRow(row));
    const totalRevenue = round(totalsRow?.revenue);
    const totalCogs = round(totalsRow?.cogs);
    const totalProfit = round(totalRevenue - totalCogs);

    return {
      period,
      currency,
      customers,
      totals: {
        revenue: totalRevenue,
        cogs: totalCogs,
        grossProfit: totalProfit,
        marginPct: percentage(totalProfit, totalRevenue),
      },
    };
  }

  /**
   * Returns the profitability of one customer plus their outstanding balance.
   */
  public async getCustomerProfitability(
    customerId: number,
    period: IDateRange,
    currency: string,
    basis: AccountingBasis,
  ): Promise<ICustomerProfitability | null> {
    const [contact] = await this.query<{
      id: number;
      display_name: string;
      balance: string;
      currency_code: string | null;
      active: number;
    }>(
      `SELECT id, display_name, balance, currency_code, active
       FROM CONTACTS
       WHERE id = ? AND contact_service = 'customer'`,
      [customerId],
    );

    if (!contact) {
      return null;
    }

    const [profitRow] = await this.query<{
      revenue: string;
      cogs: string;
      invoice_count: string;
    }>(
      `SELECT
        COALESCE(SUM(CASE WHEN a.account_type IN ${INCOME_ACCOUNT_TYPES} THEN at.credit - at.debit ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN at.costable = 1 THEN at.debit - at.credit ELSE 0 END), 0) AS cogs,
        COUNT(DISTINCT si.id) AS invoice_count
      FROM ACCOUNTS_TRANSACTIONS at
      INNER JOIN SALES_INVOICES si ON si.id = at.reference_id AND at.reference_type = 'SaleInvoice'
      INNER JOIN ACCOUNTS a ON a.id = at.account_id
      WHERE si.customer_id = ? AND at.date >= ? AND at.date <= ? AND ${this.basisClause()}`,
      [customerId, period.fromDate, period.toDate, basis],
    );

    const [lastInvoice] = await this.query<{
      last_invoice_date: string | null;
    }>(
      `SELECT MAX(si.invoice_date) AS last_invoice_date
       FROM SALES_INVOICES si
       WHERE si.customer_id = ? AND si.invoice_date >= ? AND si.invoice_date <= ?
         AND si.delivered_at IS NOT NULL`,
      [customerId, period.fromDate, period.toDate],
    );

    const profit = this.mapCustomerProfitRow({
      customer_id: contact.id,
      customer_name: contact.display_name,
      revenue: profitRow?.revenue,
      cogs: profitRow?.cogs,
      invoice_count: profitRow?.invoice_count,
    });

    return {
      ...profit,
      currencyCode: contact.currency_code,
      active: Boolean(contact.active),
      outstandingBalance: round(contact.balance),
      lastInvoiceDate: lastInvoice?.last_invoice_date
        ? moment(lastInvoice.last_invoice_date).format('YYYY-MM-DD')
        : null,
    };
  }

  private mapCustomerProfitRow(row: {
    customer_id: number;
    customer_name: string;
    revenue?: string;
    cogs?: string;
    invoice_count?: string;
  }): ICustomerProfitRow {
    const revenue = round(row.revenue);
    const cogs = round(row.cogs);
    const grossProfit = round(revenue - cogs);

    return {
      customerId: Number(row.customer_id),
      customerName: row.customer_name,
      revenue,
      cogs,
      grossProfit,
      marginPct: percentage(grossProfit, revenue),
      invoiceCount: toNumber(row.invoice_count),
    };
  }

  /**
   * Returns performance for specific items, or the top items by revenue.
   */
  public async getItemPerformance(
    period: IDateRange,
    currency: string,
    basis: AccountingBasis,
    itemIds: number[] = [],
    limit?: number,
  ): Promise<IItemPerformanceResult> {
    const safeLimit = this.clampLimit(limit, 5, 25);
    let ids = this.normalizeIds(itemIds);

    if (ids.length === 0) {
      ids = await this.getTopItemIds(period, basis, safeLimit);
    }
    if (ids.length === 0) {
      return { period, currency, items: [] };
    }

    const idClause = this.itemIdClause(ids);
    const revenueRows = await this.query<{
      item_id: number;
      item_name: string;
      item_code: string | null;
      revenue: string;
      cogs: string;
    }>(
      `SELECT
        i.id AS item_id,
        i.name AS item_name,
        i.code AS item_code,
        COALESCE(SUM(CASE WHEN a.account_type IN ${INCOME_ACCOUNT_TYPES} THEN at.credit - at.debit ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN at.costable = 1 THEN at.debit - at.credit ELSE 0 END), 0) AS cogs
      FROM ACCOUNTS_TRANSACTIONS at
      INNER JOIN SALES_INVOICES si ON si.id = at.reference_id AND at.reference_type = 'SaleInvoice'
      INNER JOIN ITEMS i ON i.id = at.item_id
      INNER JOIN ACCOUNTS a ON a.id = at.account_id
      WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}
        AND at.item_id IN (${idClause})
      GROUP BY i.id, i.name, i.code`,
      [period.fromDate, period.toDate, basis],
    );

    const quantityRows = await this.query<{
      item_id: number;
      units_sold: string;
    }>(
      `SELECT ie.item_id, COALESCE(SUM(ie.quantity), 0) AS units_sold
       FROM ITEMS_ENTRIES ie
       INNER JOIN SALES_INVOICES si ON si.id = ie.reference_id AND ie.reference_type = 'SaleInvoice'
       WHERE si.invoice_date >= ? AND si.invoice_date <= ?
         AND si.delivered_at IS NOT NULL
         AND ie.item_id IN (${idClause})
       GROUP BY ie.item_id`,
      [period.fromDate, period.toDate],
    );

    const quantityMap = new Map(
      quantityRows.map((row) => [
        Number(row.item_id),
        toNumber(row.units_sold),
      ]),
    );

    const items: IItemPerformanceRow[] = revenueRows.map((row) => {
      const revenue = round(row.revenue);
      const cogs = round(row.cogs);
      const grossProfit = round(revenue - cogs);
      const unitsSold = round(quantityMap.get(Number(row.item_id)) ?? 0, 3);

      return {
        itemId: Number(row.item_id),
        itemName: row.item_name,
        itemCode: row.item_code ?? null,
        unitsSold,
        revenue,
        cogs,
        grossProfit,
        marginPct: percentage(grossProfit, revenue),
        averageSellingPrice: unitsSold > 0 ? round(revenue / unitsSold) : 0,
      };
    });

    items.sort((a, b) => b.revenue - a.revenue);

    return { period, currency, items };
  }

  private async getTopItemIds(
    period: IDateRange,
    basis: AccountingBasis,
    limit: number,
  ): Promise<number[]> {
    const rows = await this.query<{ item_id: number }>(
      `SELECT i.id AS item_id
       FROM ACCOUNTS_TRANSACTIONS at
       INNER JOIN SALES_INVOICES si ON si.id = at.reference_id AND at.reference_type = 'SaleInvoice'
       INNER JOIN ITEMS i ON i.id = at.item_id
       INNER JOIN ACCOUNTS a ON a.id = at.account_id
       WHERE at.date >= ? AND at.date <= ? AND ${this.basisClause()}
         AND at.item_id IS NOT NULL
         AND a.account_type IN ${INCOME_ACCOUNT_TYPES}
       GROUP BY i.id
       ORDER BY SUM(at.credit - at.debit) DESC
       LIMIT ${limit}`,
      [period.fromDate, period.toDate, basis],
    );
    return rows.map((row) => Number(row.item_id));
  }

  /**
   * Returns customer receivable balances.
   */
  public async getOutstandingReceivables(
    currency: string,
    limit?: number,
  ): Promise<IReceivablesResult> {
    const safeLimit = this.clampLimit(limit, 10, 25);
    const rows = await this.query<{
      customer_id: number;
      customer_name: string;
      balance: string;
      currency_code: string | null;
      active: number;
    }>(
      `SELECT id AS customer_id, display_name AS customer_name,
        balance, currency_code, active
       FROM CONTACTS
       WHERE contact_service = 'customer' AND balance > 0
       ORDER BY balance DESC
       LIMIT ${safeLimit}`,
    );

    const [totalRow] = await this.query<{ total: string }>(
      `SELECT COALESCE(SUM(balance), 0) AS total
       FROM CONTACTS
       WHERE contact_service = 'customer' AND balance > 0
         AND (currency_code = ? OR currency_code IS NULL)`,
      [currency],
    );

    const customers: IReceivableRow[] = rows.map((row) => ({
      customerId: Number(row.customer_id),
      customerName: row.customer_name,
      balance: round(row.balance),
      currencyCode: row.currency_code,
      active: Boolean(row.active),
    }));

    return {
      currency,
      total: round(totalRow?.total),
      customers,
    };
  }

  /**
   * Returns cash and bank account balances.
   */
  public async getCashPosition(currency: string): Promise<ICashPositionResult> {
    const rows = await this.query<{
      account_id: number;
      name: string;
      account_type: string;
      currency_code: string | null;
      balance: string;
    }>(
      `SELECT id AS account_id, name, account_type, currency_code, amount AS balance
       FROM ACCOUNTS
       WHERE active = 1 AND account_type IN ('cash','bank')
       ORDER BY account_type ASC, name ASC
       LIMIT 50`,
    );

    const [totalRow] = await this.query<{ total: string }>(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM ACCOUNTS
       WHERE active = 1 AND account_type IN ('cash','bank')
         AND (currency_code = ? OR currency_code IS NULL)`,
      [currency],
    );

    return {
      currency,
      total: round(totalRow?.total),
      accounts: rows.map((row) => ({
        accountId: Number(row.account_id),
        name: row.name,
        accountType: row.account_type,
        currencyCode: row.currency_code,
        balance: round(row.balance),
      })),
    };
  }

  /**
   * Returns inventory items with low stock first.
   */
  public async getInventoryLevels(
    currency: string,
    limit?: number,
  ): Promise<IInventoryLevelsResult> {
    const safeLimit = this.clampLimit(limit, 10, 50);
    const rows = await this.query<{
      item_id: number;
      name: string;
      code: string | null;
      quantity_on_hand: string;
      reorder_point: string | null;
      cost_price: string;
    }>(
      `SELECT id AS item_id, name, code, quantity_on_hand, reorder_point, cost_price
       FROM ITEMS
       WHERE active = 1 AND type = 'inventory'
       ORDER BY
         CASE WHEN reorder_point IS NOT NULL AND quantity_on_hand <= reorder_point THEN 0 ELSE 1 END,
         quantity_on_hand ASC
       LIMIT ${safeLimit}`,
    );

    return {
      currency,
      items: rows.map((row) => {
        const quantityOnHand = round(row.quantity_on_hand, 3);
        const reorderPoint =
          row.reorder_point === null ? null : round(row.reorder_point, 3);
        const costPrice = round(row.cost_price);

        return {
          itemId: Number(row.item_id),
          name: row.name,
          code: row.code,
          quantityOnHand,
          reorderPoint,
          costPrice,
          estimatedValue: round(quantityOnHand * costPrice),
          lowStock: reorderPoint !== null && quantityOnHand <= reorderPoint,
        };
      }),
    };
  }

  /**
   * Searches customers by display name or code.
   */
  public async searchCustomers(
    term: string,
    limit?: number,
  ): Promise<IRecordMatch[]> {
    const safeLimit = this.clampLimit(limit, 5, 10);
    const pattern = `%${term.trim().toLowerCase()}%`;
    const rows = await this.query<{
      id: number;
      name: string;
      code: string | null;
      active: number;
      currency_code: string | null;
    }>(
      `SELECT id, display_name AS name, code, active, currency_code
       FROM CONTACTS
       WHERE contact_service = 'customer'
         AND (LOWER(display_name) LIKE ? OR LOWER(COALESCE(code, '')) LIKE ?)
       ORDER BY active DESC, display_name ASC
       LIMIT ${safeLimit}`,
      [pattern, pattern],
    );

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      code: row.code,
      active: Boolean(row.active),
      currencyCode: row.currency_code,
    }));
  }

  /**
   * Searches vendors by display name or code.
   */
  public async searchVendors(
    term: string,
    limit?: number,
  ): Promise<IRecordMatch[]> {
    const safeLimit = this.clampLimit(limit, 5, 10);
    const pattern = `%${term.trim().toLowerCase()}%`;
    const rows = await this.query<{
      id: number;
      name: string;
      code: string | null;
      active: number;
      currency_code: string | null;
    }>(
      `SELECT id, display_name AS name, code, active, currency_code
       FROM CONTACTS
       WHERE contact_service = 'vendor'
         AND (LOWER(display_name) LIKE ? OR LOWER(COALESCE(code, '')) LIKE ?)
       ORDER BY active DESC, display_name ASC
       LIMIT ${safeLimit}`,
      [pattern, pattern],
    );

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      code: row.code,
      active: Boolean(row.active),
      currencyCode: row.currency_code,
    }));
  }

  /**
   * Searches items by name or code.
   */
  public async searchItems(
    term: string,
    limit?: number,
  ): Promise<IRecordMatch[]> {
    const safeLimit = this.clampLimit(limit, 5, 10);
    const pattern = `%${term.trim().toLowerCase()}%`;
    const rows = await this.query<{
      id: number;
      name: string;
      code: string | null;
      active: number;
      type: string;
    }>(
      `SELECT id, name, code, active, type
       FROM ITEMS
       WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(code, '')) LIKE ?
       ORDER BY active DESC, name ASC
       LIMIT ${safeLimit}`,
      [pattern, pattern],
    );

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      code: row.code,
      active: Boolean(row.active),
      type: row.type,
    }));
  }
}
