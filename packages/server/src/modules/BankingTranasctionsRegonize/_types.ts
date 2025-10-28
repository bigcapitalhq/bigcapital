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
  transactionsCriteria: any;
}