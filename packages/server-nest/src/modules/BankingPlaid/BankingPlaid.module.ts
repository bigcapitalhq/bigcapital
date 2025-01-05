import { Module } from '@nestjs/common';
import { PlaidUpdateTransactionsOnItemCreatedSubscriber } from './subscribers/PlaidUpdateTransactionsOnItemCreatedSubscriber';
import { PlaidUpdateTransactions } from './command/PlaidUpdateTransactions';
import { PlaidSyncDb } from './command/PlaidSyncDB';
import { PlaidWebooks } from './command/PlaidWebhooks';
import { PlaidLinkTokenService } from './queries/GetPlaidLinkToken.service';
import { PlaidApplication } from './PlaidApplication';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { PlaidItem } from './models/PlaidItem';
import { PlaidModule } from '../Plaid/Plaid.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { BankingCategorizeModule } from '../BankingCategorize/BankingCategorize.module';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { PlaidItemService } from './command/PlaidItem';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { SystemPlaidItem } from './models/SystemPlaidItem';

const models = [
  RegisterTenancyModel(PlaidItem),
  InjectSystemModel(SystemPlaidItem),
];

@Module({
  imports: [
    PlaidModule,
    AccountsModule,
    BankingCategorizeModule,
    BankingTransactionsModule,
  ],
  providers: [
    ...models,
    PlaidItemService,
    PlaidUpdateTransactions,
    PlaidSyncDb,
    PlaidWebooks,
    PlaidLinkTokenService,
    PlaidApplication,
    PlaidUpdateTransactionsOnItemCreatedSubscriber,
    TenancyContext,
  ],
  exports: [...models],
})
export class BankingPlaidModule {}
