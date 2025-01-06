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
import { BillPaymentsModule } from '../BillPayments/BillPayments.module';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { MatchBankTransactions } from './commands/MatchTransactions';
import { MatchTransactionsTypes } from './commands/MatchTransactionsTypes';
import { GetMatchedTransactionsByManualJournals } from './queries/GetMatchedTransactionsByManualJournals.service';
import { ValidateTransactionMatched } from './commands/ValidateTransactionsMatched.service';
import { BankingMatchingController } from './BankingMatching.controller';

const models = [RegisterTenancyModel(MatchedBankTransaction)];

@Module({
  controllers: [BankingMatchingController],
  imports: [
    BillPaymentsModule,
    BankingTransactionsModule,
    PaymentsReceivedModule,
  ],
  providers: [
    ...models,
    ValidateTransactionMatched,
    MatchBankTransactions,
    MatchTransactionsTypes,
    GetMatchedTransactionsByBills,
    GetMatchedTransactionsByCashflow,
    GetMatchedTransactionsByExpenses,
    GetMatchedTransactionsByInvoices,
    GetMatchedTransactionsByManualJournals,
    BankingMatchingApplication,
    GetMatchedTransactions,
    UnmatchMatchedBankTransaction,
    ValidateMatchingOnExpenseDeleteSubscriber,
    ValidateMatchingOnPaymentReceivedDeleteSubscriber,
    DecrementUncategorizedTransactionOnMatchingSubscriber,
    ValidateMatchingOnPaymentMadeDeleteSubscriber,
    ValidateMatchingOnManualJournalDeleteSubscriber,
    ValidateMatchingOnCashflowDeleteSubscriber,
  ],
  exports: [...models],
})
export class BankingMatchingModule {}
