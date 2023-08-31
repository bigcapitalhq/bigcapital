export interface SalesTaxLiabilitySummaryQuery {
  fromDate: Date;
  toDate: Date;
  basis: 'cash' | 'accrual';
}

export interface SalesTaxLiabilitySummaryAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface SalesTaxLiabilitySummaryTotal {
  taxableAmount: SalesTaxLiabilitySummaryAmount;
  taxAmount: SalesTaxLiabilitySummaryAmount;
}

export interface SalesTaxLiabilitySummaryRate {
  taxName: string;
  taxCode: string;
  taxableAmount: SalesTaxLiabilitySummaryAmount;
  taxAmount: SalesTaxLiabilitySummaryAmount;
}

export enum SalesTaxLiabilitySummaryTableRowType {
  TaxRate = 'TaxRate',
  Total = 'Total',
}

export interface SalesTaxLiabilitySummaryReportData {
  taxRates: SalesTaxLiabilitySummaryRate[];
  total: SalesTaxLiabilitySummaryTotal;
}
