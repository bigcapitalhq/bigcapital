import { Module } from '@nestjs/common';
import { ExcludeBankTransactionsApplication } from './ExcludeBankTransactionsApplication';
import { ExcludeBankTransactionService } from './commands/ExcludeBankTransaction.service';
import { UnexcludeBankTransactionService } from './commands/UnexcludeBankTransaction.service';
import { GetExcludedBankTransactionsService } from './queries/GetExcludedBankTransactions';
import { ExcludeBankTransactionsService } from './commands/ExcludeBankTransactions.service';
import { UnexcludeBankTransactionsService } from './commands/UnexcludeBankTransactions.service';
import { DecrementUncategorizedTransactionOnExclude } from './subscribers/DecrementUncategorizedTransactionOnExclude';
import { BankingTransactionsExcludeController } from './BankingTransactionsExclude.controller';

@Module({
  providers: [
    ExcludeBankTransactionsApplication,
    ExcludeBankTransactionService,
    UnexcludeBankTransactionService,
    GetExcludedBankTransactionsService,
    ExcludeBankTransactionsService,
    UnexcludeBankTransactionsService,
    DecrementUncategorizedTransactionOnExclude
  ],
  controllers: [BankingTransactionsExcludeController],
})
export class BankingTransactionsExcludeModule {}
