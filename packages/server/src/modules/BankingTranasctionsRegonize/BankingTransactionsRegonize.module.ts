import { forwardRef, Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { RecognizedBankTransaction } from './models/RecognizedBankTransaction';
import { GetAutofillCategorizeTransactionService } from './queries/GetAutofillCategorizeTransaction.service';
import { RevertRecognizedTransactionsService } from './commands/RevertRecognizedTransactions.service';
import { RecognizeTranasctionsService } from './commands/RecognizeTranasctions.service';
import { TriggerRecognizedTransactionsSubscriber } from './events/TriggerRecognizedTransactions';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { BankRulesModule } from '../BankRules/BankRules.module';
import { BankingRecognizedTransactionsController } from './BankingRecognizedTransactions.controller';
import { RecognizedTransactionsApplication } from './RecognizedTransactions.application';
import { GetRecognizedTransactionsService } from './GetRecongizedTransactions';
import { GetRecognizedTransactionService } from './queries/GetRecognizedTransaction.service';

const models = [RegisterTenancyModel(RecognizedBankTransaction)];

@Module({
  imports: [
    BankingTransactionsModule,
    forwardRef(() => BankRulesModule),
    ...models,
  ],
  providers: [
    RecognizedTransactionsApplication,
    GetRecognizedTransactionsService,
    GetAutofillCategorizeTransactionService,
    RevertRecognizedTransactionsService,
    RecognizeTranasctionsService,
    TriggerRecognizedTransactionsSubscriber,
    GetRecognizedTransactionService,
  ],
  exports: [
    ...models,
    GetAutofillCategorizeTransactionService,
    RevertRecognizedTransactionsService,
    RecognizeTranasctionsService,
  ],
  controllers: [BankingRecognizedTransactionsController],
})
export class BankingTransactionsRegonizeModule {}
