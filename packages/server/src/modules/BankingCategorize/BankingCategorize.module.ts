import { Module } from '@nestjs/common';
import { CreateUncategorizedTransactionService } from './commands/CreateUncategorizedTransaction.service';
import { CategorizeTransactionAsExpense } from './commands/CategorizeTransactionAsExpense';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { ExpensesModule } from '../Expenses/Expenses.module';
import { UncategorizedTransactionsImportable } from './commands/UncategorizedTransactionsImportable';

@Module({
  imports: [BankingTransactionsModule, ExpensesModule],
  providers: [
    CreateUncategorizedTransactionService,
    CategorizeTransactionAsExpense,
    UncategorizedTransactionsImportable
  ],
  exports: [
    CreateUncategorizedTransactionService,
    CategorizeTransactionAsExpense,
  ],
})
export class BankingCategorizeModule {}
