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
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { LedgerModule } from '../Ledger/Ledger.module';
import { DeleteCashflowTransaction } from './commands/DeleteCashflowTransaction.service';
import { CreateBankTransactionService } from './commands/CreateBankTransaction.service';
import { GetBankTransactionService } from './queries/GetBankTransaction.service';
import { CommandBankTransactionValidator } from './commands/CommandCasflowValidator.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesModule } from '../Branches/Branches.module';
import { RemovePendingUncategorizedTransaction } from './commands/RemovePendingUncategorizedTransaction.service';

const models = [
  RegisterTenancyModel(UncategorizedBankTransaction),
  RegisterTenancyModel(BankTransaction),
  RegisterTenancyModel(BankTransactionLine),
];

@Module({
  imports: [AutoIncrementOrdersModule, LedgerModule, BranchesModule],
  providers: [
    BankTransactionAutoIncrement,
    BankTransactionGLEntriesService,
    ValidateDeleteBankAccountTransactions,
    BankingTransactionGLEntriesSubscriber,
    DecrementUncategorizedTransactionOnCategorizeSubscriber,
    DeleteCashflowTransactionOnUncategorizeSubscriber,
    PreventDeleteTransactionOnDeleteSubscriber,
    BankingTransactionsApplication,
    DeleteCashflowTransaction,
    CreateBankTransactionService,
    GetBankTransactionService,
    CommandBankTransactionValidator,
    BranchTransactionDTOTransformer,
    RemovePendingUncategorizedTransaction,
    ...models,
  ],
  exports: [...models, RemovePendingUncategorizedTransaction],
})
export class BankingTransactionsModule {}
