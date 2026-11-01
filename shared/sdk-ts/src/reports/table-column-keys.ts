import type { components } from '../schema';

/**
 * Per-report table column key types, derived from the server OpenAPI spec.
 *
 * These unions are the single source of truth for the `key` values emitted by
 * each financial statement table. The webapp column mappers reference them so
 * any key change on the server (after regenerating the SDK) surfaces as a
 * type error in the webapp instead of a runtime crash / mis-styled column.
 */
export type BalanceSheetColumnKey =
  components['schemas']['BalanceSheetTableColumnDto']['key'];

export type ProfitLossColumnKey =
  components['schemas']['ProfitLossSheetTableColumnDto']['key'];

export type TrialBalanceColumnKey =
  components['schemas']['TrialBalanceSheetTableColumnDto']['key'];

export type CashFlowColumnKey =
  components['schemas']['CashflowStatementTableColumnDto']['key'];

export type AgingSummaryColumnKey =
  components['schemas']['ARAgingSummaryTableColumnDto']['key'];

export type GeneralLedgerColumnKey =
  components['schemas']['GeneralLedgerTableColumnDto']['key'];

export type JournalColumnKey =
  components['schemas']['JournalSheetTableColumnDto']['key'];

export type CustomersBalanceColumnKey =
  components['schemas']['CustomerBalanceSummaryTableColumnDto']['key'];

export type VendorsBalanceColumnKey =
  components['schemas']['VendorBalanceSummaryTableColumnDto']['key'];

export type SalesByItemsColumnKey =
  components['schemas']['SalesByItemsTableColumnDto']['key'];

export type PurchasesByItemsColumnKey =
  components['schemas']['PurchasesByItemsTableColumnDto']['key'];

export type InventoryValuationColumnKey =
  components['schemas']['InventoryValuationTableColumnDto']['key'];

export type InventoryItemDetailsColumnKey =
  components['schemas']['InventoryItemDetailsTableColumnDto']['key'];

export type SalesTaxLiabilityColumnKey =
  components['schemas']['SalesTaxLiabilitySummaryTableColumnDto']['key'];
