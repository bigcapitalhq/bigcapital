import { UncategorizedBankTransaction } from "@/modules/BankingTransactions/models/UncategorizedBankTransaction";
import { Knex } from "knex";

export interface ICashflowTransactionCategorizedPayload {
  uncategorizedTransactions: Array<UncategorizedBankTransaction>;
  cashflowTransaction: UncategorizedBankTransaction;
  oldUncategorizedTransactions: Array<UncategorizedBankTransaction>;
  categorizeDTO: any;
  trx: Knex.Transaction;
}

export interface ICashflowTransactionUncategorizingPayload {
  uncategorizedTransactionId: number;
  oldUncategorizedTransactions: Array<UncategorizedBankTransaction>;
  trx: Knex.Transaction;
}

export interface ICashflowTransactionUncategorizedPayload {
  uncategorizedTransactionId: number;
  uncategorizedTransactions: Array<UncategorizedBankTransaction>;
  oldMainUncategorizedTransaction: UncategorizedBankTransaction;
  oldUncategorizedTransactions: Array<UncategorizedBankTransaction>;
  trx: Knex.Transaction;
}

export interface ICategorizeCashflowTransactioDTO {
  date: Date;
  creditAccountId: number;
  referenceNo: string;
  transactionNumber: string;
  transactionType: string;
  exchangeRate: number;
  description: string;
  branchId: number;
}


export interface IUncategorizedTransactionCreatingEventPayload {
  tenantId: number;
  createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO;
  trx: Knex.Transaction;
}

export interface IUncategorizedTransactionCreatedEventPayload {
  tenantId: number;
  uncategorizedTransaction: any;
  createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO;
  trx: Knex.Transaction;
}

export interface CreateUncategorizedTransactionDTO {
  date: Date | string;
  accountId: number;
  amount: number;
  currencyCode: string;
  payee?: string;
  description?: string;
  referenceNo?: string | null;
  plaidTransactionId?: string | null;
  pending?: boolean;
  pendingPlaidTransactionId?: string | null;
  batch?: string;
}
