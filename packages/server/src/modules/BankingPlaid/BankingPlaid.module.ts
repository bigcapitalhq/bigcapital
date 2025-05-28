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
import { BankingPlaidController } from './BankingPlaid.controller';

const models = [RegisterTenancyModel(PlaidItem)];

@Module({
  imports: [
    PlaidModule,
    AccountsModule,
    BankingCategorizeModule,
    BankingTransactionsModule,
    ...models,
  ],
  providers: [
    InjectSystemModel(SystemPlaidItem),
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
  controllers: [BankingPlaidController]
})
export class BankingPlaidModule {}
