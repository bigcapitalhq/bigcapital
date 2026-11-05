import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { SocketModule } from '../Socket/Socket.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { BankingCategorizeModule } from '../BankingCategorize/BankingCategorize.module';
import { BankingTransactionsModule } from '../BankingTransactions/BankingTransactions.module';
import { BankingTransactionsRegonizeModule } from '../BankingTranasctionsRegonize/BankingTransactionsRegonize.module';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { SimpleFinItem } from './models/SimpleFinItem';
import { SystemSimpleFinItem } from './models/SystemSimpleFinItem';
import { SimpleFinClient } from './SimpleFinClient.service';
import { SimpleFinApplication } from './SimpleFinApplication';
import { BankingSimpleFinController } from './BankingSimpleFin.controller';
import { ClaimSimpleFinTokenService } from './commands/ClaimSimpleFinToken.service';
import { LinkSimpleFinAccountsService } from './commands/LinkSimpleFinAccounts.service';
import { SimpleFinSyncTransactionsService } from './commands/SimpleFinSyncTransactions.service';
import { DisconnectSimpleFinItemService } from './commands/DisconnectSimpleFinItem.service';
import { SetupSimpleFinItemTenantService } from './commands/SetupSimpleFinItemTenant.service';
import { SimpleFinSyncQueueService } from './commands/SimpleFinSyncQueue.service';
import { SimpleFinSyncProcessor } from './jobs/SimpleFinSyncJob';
import { SimpleFinScheduledSyncJob } from './jobs/SimpleFinScheduledSync.job';
import { SimpleFinSyncOnItemLinkedSubscriber } from './subscribers/SimpleFinSyncOnItemLinked.subscriber';
import { RecognizeSimpleFinSyncedTransactionsSubscriber } from './subscribers/RecognizeSimpleFinSyncedTransactions.subscriber';
import { DisconnectSimpleFinItemOnAccountDeleted } from './subscribers/DisconnectSimpleFinItemOnAccountDeleted';
import { SimpleFinSyncQueue } from './types/BankingSimpleFin.types';

const models = [RegisterTenancyModel(SimpleFinItem)];

@Module({
  imports: [
    TenancyModule,
    SocketModule,
    AccountsModule,
    BankingCategorizeModule,
    BankingTransactionsModule,
    BankingTransactionsRegonizeModule,
    BullModule.registerQueue({
      name: SimpleFinSyncQueue,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    BullBoardModule.forFeature({
      name: SimpleFinSyncQueue,
      adapter: BullMQAdapter,
    }),
    ...models,
  ],
  providers: [
    InjectSystemModel(SystemSimpleFinItem),
    SimpleFinClient,
    SimpleFinApplication,
    ClaimSimpleFinTokenService,
    LinkSimpleFinAccountsService,
    SimpleFinSyncTransactionsService,
    DisconnectSimpleFinItemService,
    SetupSimpleFinItemTenantService,
    SimpleFinSyncQueueService,
    SimpleFinSyncProcessor,
    SimpleFinScheduledSyncJob,
    SimpleFinSyncOnItemLinkedSubscriber,
    RecognizeSimpleFinSyncedTransactionsSubscriber,
    DisconnectSimpleFinItemOnAccountDeleted,
  ],
  exports: [
    ...models,
    InjectSystemModel(SystemSimpleFinItem),
    SimpleFinSyncQueueService,
    DisconnectSimpleFinItemService,
  ],
  controllers: [BankingSimpleFinController],
})
export class BankingSimpleFinModule {}
