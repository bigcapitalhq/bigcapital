import { TenantJobPayload } from "@/interfaces/Tenant";

export interface RevertRecognizedTransactionsCriteria {
  batch?: string;
  accountId?: number;
}

export interface RecognizeTransactionsCriteria {
  batch?: string;
  accountId?: number;
}

export const RecognizeUncategorizedTransactionsJob =
  'recognize-uncategorized-transactions-job';
export const RecognizeUncategorizedTransactionsQueue =
  'recognize-uncategorized-transactions-queue';

export interface RecognizeUncategorizedTransactionsJobPayload extends TenantJobPayload {
  ruleId: number,
  transactionsCriteria?: RecognizeTransactionsCriteria;
  /**
   * When true, first reverts recognized transactions before recognizing again.
   * Used when a bank rule is edited to ensure transactions previously recognized
   * by lower-priority rules are re-evaluated against the updated rule.
   */
  shouldRevert?: boolean;
}