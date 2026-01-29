import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SocketModule } from '../Socket/Socket.module';
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
import { BankingPlaidWebhooksController } from './BankingPlaidWebhooks.controller';
import { SetupPlaidItemTenantService } from './command/SetupPlaidItemTenant.service';
import { UpdateBankingPlaidTransitionsQueueJob } from './types/BankingPlaid.types';
import { PlaidFetchTransactionsProcessor } from './jobs/PlaidFetchTransactionsJob';

const models = [RegisterTenancyModel(PlaidItem)];

@Module({
  imports: [
    SocketModule,
    PlaidModule,
    AccountsModule,
    BankingCategorizeModule,
    BankingTransactionsModule,
    BullModule.registerQueue({ name: UpdateBankingPlaidTransitionsQueueJob }),
    BullBoardModule.forFeature({
      name: UpdateBankingPlaidTransitionsQueueJob,
      adapter: BullMQAdapter,
    }),
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
    SetupPlaidItemTenantService,
    TenancyContext,
    PlaidFetchTransactionsProcessor,
    PlaidUpdateTransactionsOnItemCreatedSubscriber,
  ],
  exports: [...models],
  controllers: [BankingPlaidController, BankingPlaidWebhooksController],
})
export class BankingPlaidModule {}
