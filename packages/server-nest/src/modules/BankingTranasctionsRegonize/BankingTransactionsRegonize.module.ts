import { forwardRef, Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { RecognizedBankTransaction } from './models/RecognizedBankTransaction';
import { GetAutofillCategorizeTransactionService } from './queries/GetAutofillCategorizeTransaction.service';
import { RevertRecognizedTransactionsService } from './commands/RevertRecognizedTransactions.service';
import { RecognizeTranasctionsService } from './commands/RecognizeTranasctions.service';
import { TriggerRecognizedTransactionsSubscriber } from './events/TriggerRecognizedTransactions';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { BankRulesModule } from '../BankRules/BankRules.module';

const models = [RegisterTenancyModel(RecognizedBankTransaction)];

@Module({
  imports: [BankingTransactionsModule, forwardRef(() => BankRulesModule)],
  providers: [
    ...models,
    GetAutofillCategorizeTransactionService,
    RevertRecognizedTransactionsService,
    RecognizeTranasctionsService,
    TriggerRecognizedTransactionsSubscriber,
  ],
  exports: [
    ...models,
    GetAutofillCategorizeTransactionService,
    RevertRecognizedTransactionsService,
    RecognizeTranasctionsService,
  ],
})
export class BankingTransactionsRegonizeModule {}
