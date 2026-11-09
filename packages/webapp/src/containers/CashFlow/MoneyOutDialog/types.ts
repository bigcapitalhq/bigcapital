/**
 * Shared form values shape for the MoneyOutDialog form. All consumers
 * (Form, FormDialog, ExchangeRateField, ContentFields, TransactionTypeFields,
 * the per-type field components, utils, and the shared _components.tsx) read
 * and write these fields.
 *
 * Field names mirror the SDK `CreateCashflowTransactionBody` camelCase shape
 * so the submit-time transform is a near 1:1 mapping.
 */
export interface MoneyOutFormValues {
  date: string;
  amount: string | number;
  transactionNumber: string;
  transactionNumberManually?: string;
  transactionType: string;
  referenceNo: string;
  cashflowAccountId: string | number;
  creditAccountId: string | number;
  currencyCode: string;
  description: string;
  branchId: string | number;
  publish: string | boolean;
  exchangeRate: number;
}
