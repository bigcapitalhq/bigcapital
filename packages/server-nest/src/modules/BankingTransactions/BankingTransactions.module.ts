import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { UncategorizedBankTransaction } from './models/UncategorizedBankTransaction';
import { BankTransactionLine } from './models/BankTransactionLine';
import { BankTransaction } from './models/BankTransaction';
import { BankTransactionAutoIncrement } from './commands/BankTransactionAutoIncrement.service';
import BankingTransactionGLEntriesSubscriber from './subscribers/CashflowTransactionSubscriber';
import { DecrementUncategorizedTransactionOnCategorizeSubscriber } from './subscribers/DecrementUncategorizedTransactionOnCategorize';
import { DeleteCashflowTransactionOnUncategorizeSubscriber } from './subscribers/DeleteCashflowTransactionOnUncategorize';
import { PreventDeleteTransactionOnDeleteSubscriber } from './subscribers/PreventDeleteTransactionsOnDelete';
import { ValidateDeleteBankAccountTransactions } from './commands/ValidateDeleteBankAccountTransactions.service';
import { BankTransactionGLEntriesService } from './commands/BankTransactionGLEntries';
import { BankingTransactionsApplication } from './BankingTransactionsApplication.service';

const models = [
  RegisterTenancyModel(UncategorizedBankTransaction),
  RegisterTenancyModel(BankTransaction),
  RegisterTenancyModel(BankTransactionLine),
];

@Module({
  exports: [
    BankTransactionAutoIncrement,
    BankTransactionGLEntriesService,
    ValidateDeleteBankAccountTransactions,
    BankingTransactionGLEntriesSubscriber,
    DecrementUncategorizedTransactionOnCategorizeSubscriber,
    DeleteCashflowTransactionOnUncategorizeSubscriber,
    PreventDeleteTransactionOnDeleteSubscriber,
    BankingTransactionsApplication,
    ...models,
  ],
  providers: [...models],
})
export class BankingTransactionsModule {}
