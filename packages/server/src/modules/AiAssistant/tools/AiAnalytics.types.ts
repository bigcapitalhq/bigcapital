import type { IDateRange } from '../utils/date-range';

export interface IFinancialSummary {
  period: IDateRange;
  currency: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  grossMarginPct: number;
  netMarginPct: number;
  invoiceCount: number;
  invoicedTotal: number;
  averageInvoiceValue: number;
}

export interface IProfitAndLossAccount {
  accountId: number;
  name: string;
  accountType: string;
  amount: number;
  percentage: number;
}

export interface IProfitAndLossBreakdown {
  period: IDateRange;
  currency: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  income: IProfitAndLossAccount[];
  costOfGoodsSold: IProfitAndLossAccount[];
  expenses: IProfitAndLossAccount[];
}

export interface ICustomerProfitRow {
  customerId: number;
  customerName: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  marginPct: number;
  invoiceCount: number;
}

export interface ITopCustomersResult {
  period: IDateRange;
  currency: string;
  customers: ICustomerProfitRow[];
  totals: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    marginPct: number;
  };
}

export interface ICustomerProfitability extends ICustomerProfitRow {
  currencyCode: string | null;
  active: boolean;
  outstandingBalance: number;
  lastInvoiceDate: string | null;
}

export interface IItemPerformanceRow {
  itemId: number;
  itemName: string;
  itemCode: string | null;
  unitsSold: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  marginPct: number;
  averageSellingPrice: number;
}

export interface IItemPerformanceResult {
  period: IDateRange;
  currency: string;
  items: IItemPerformanceRow[];
}

export interface IReceivableRow {
  customerId: number;
  customerName: string;
  balance: number;
  currencyCode: string | null;
  active: boolean;
}

export interface IReceivablesResult {
  currency: string;
  total: number;
  customers: IReceivableRow[];
}

export interface ICashAccountRow {
  accountId: number;
  name: string;
  accountType: string;
  currencyCode: string | null;
  balance: number;
}

export interface ICashPositionResult {
  currency: string;
  total: number;
  accounts: ICashAccountRow[];
}

export interface IInventoryItemRow {
  itemId: number;
  name: string;
  code: string | null;
  quantityOnHand: number;
  reorderPoint: number | null;
  costPrice: number;
  estimatedValue: number;
  lowStock: boolean;
}

export interface IInventoryLevelsResult {
  currency: string;
  items: IInventoryItemRow[];
}

export interface IRecordMatch {
  id: number;
  name: string;
  code: string | null;
  active: boolean;
  currencyCode?: string | null;
  type?: string;
}
