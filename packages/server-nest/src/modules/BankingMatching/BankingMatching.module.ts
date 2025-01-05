import { Module } from '@nestjs/common';
import { MatchedBankTransaction } from './models/MatchedBankTransaction';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { BankingMatchingApplication } from './BankingMatchingApplication';
import { GetMatchedTransactions } from './queries/GetMatchedTransactions.service';
import { UnmatchMatchedBankTransaction } from './commands/UnmatchMatchedTransaction.service';
import { GetMatchedTransactionsByBills } from './queries/GetMatchedTransactionsByBills.service';
import { GetMatchedTransactionsByCashflow } from './queries/GetMatchedTransactionsByCashflow';
import { GetMatchedTransactionsByExpenses } from './queries/GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByInvoices } from './queries/GetMatchedTransactionsByInvoices.service';
import { ValidateMatchingOnExpenseDeleteSubscriber } from './events/ValidateMatchingOnExpenseDelete';
import { ValidateMatchingOnPaymentReceivedDeleteSubscriber } from './events/ValidateMatchingOnPaymentReceivedDelete';
import { DecrementUncategorizedTransactionOnMatchingSubscriber } from './events/DecrementUncategorizedTransactionsOnMatch';
import { ValidateMatchingOnPaymentMadeDeleteSubscriber } from './events/ValidateMatchingOnPaymentMadeDelete';
import { ValidateMatchingOnManualJournalDeleteSubscriber } from './events/ValidateMatchingOnManualJournalDelete';
import { ValidateMatchingOnCashflowDeleteSubscriber } from './events/ValidateMatchingOnCashflowDelete';

const models = [RegisterTenancyModel(MatchedBankTransaction)];

@Module({
  providers: [
    ...models,
    GetMatchedTransactionsByBills,
    GetMatchedTransactionsByCashflow,
    GetMatchedTransactionsByExpenses,
    GetMatchedTransactionsByInvoices,
    BankingMatchingApplication,
    GetMatchedTransactions,
    UnmatchMatchedBankTransaction,
    ValidateMatchingOnExpenseDeleteSubscriber,
    ValidateMatchingOnPaymentReceivedDeleteSubscriber,
    DecrementUncategorizedTransactionOnMatchingSubscriber,
    ValidateMatchingOnPaymentMadeDeleteSubscriber,
    ValidateMatchingOnManualJournalDeleteSubscriber,
    ValidateMatchingOnCashflowDeleteSubscriber
  ],
  exports: [...models],
})
export class BankingMatchingModule {}
