import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { RecognizedBankTransaction } from './models/RecognizedBankTransaction';
import { GetAutofillCategorizeTransactionService } from './queries/GetAutofillCategorizeTransaction.service';
import { RevertRecognizedTransactionsService } from './commands/RevertRecognizedTransactions.service';
import { RecognizeTranasctionsService } from './commands/RecognizeTranasctions.service';
import { TriggerRecognizedTransactionsSubscriber } from './events/TriggerRecognizedTransactions';

const models = [RegisterTenancyModel(RecognizedBankTransaction)];

@Module({
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
