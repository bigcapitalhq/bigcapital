import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '@/modules/Tenancy/TenancyDB/TenancyDB.module';
import { RegisterTenancyModel } from '@/modules/Tenancy/TenancyModels/Tenancy.module';
import { DynamicListModule } from '@/modules/DynamicListing/DynamicList.module';
import { ManualJournalsModule } from '@/modules/ManualJournals/ManualJournals.module';
import { TrackingCategoriesModule } from '@/modules/TrackingCategories/TrackingCategories.module';
import { BranchesModule } from '@/modules/Branches/Branches.module';
import { AutoIncrementOrdersModule } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.module';
import { FeaturesModule } from '@/modules/Features/Features.module';
import { InjectSystemModel } from '@/modules/System/SystemModels/SystemModels.module';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { RecurringJournal } from './models/RecurringJournal';
import { RecurringJournalEntry } from './models/RecurringJournalEntry';
import { RecurringJournalEntryTrackingCategory } from './models/RecurringJournalEntryTrackingCategory';
import { RecurringJournalsController } from './RecurringJournals.controller';
import { RecurringJournalsApplication } from './RecurringJournals.application';
import { RecurringJournalDTOTransformer } from './commands/RecurringJournalDTOTransformer.service';
import { RecurringJournalValidators } from './commands/RecurringJournalValidators.service';
import { CreateRecurringJournal } from './commands/CreateRecurringJournal.service';
import { EditRecurringJournal } from './commands/EditRecurringJournal.service';
import { DeleteRecurringJournal } from './commands/DeleteRecurringJournal.service';
import { PauseRecurringJournal } from './commands/PauseRecurringJournal.service';
import { ResumeRecurringJournal } from './commands/ResumeRecurringJournal.service';
import { GenerateRecurringJournal } from './commands/GenerateRecurringJournal.service';
import { GenerateDueRecurringJournals } from './commands/GenerateDueRecurringJournals.service';
import { GetRecurringJournals } from './queries/GetRecurringJournals.service';
import { GetRecurringJournal } from './queries/GetRecurringJournal.service';
import { GetRecurringJournalJournals } from './queries/GetRecurringJournalJournals.service';
import { RecurringJournalsQueue } from './services/RecurringJournalsQueue.service';
import { ScanRecurringJournals } from './services/ScanRecurringJournals.service';
import { RecurringJournalsBootstrap } from './services/RecurringJournalsBootstrap.service';
import { RecurringJournalsProcessor } from './processors/RecurringJournals.processor';
import { RecurringJournalsFeatureGuard } from './RecurringJournalsFeatureGuard';
import { RECURRING_JOURNALS_QUEUE } from './RecurringJournal.types';

const models = [
  RegisterTenancyModel(RecurringJournal),
  RegisterTenancyModel(RecurringJournalEntry),
  RegisterTenancyModel(RecurringJournalEntryTrackingCategory),
];

@Module({
  imports: [
    ...models,
    TenancyModule,
    TenancyDatabaseModule,
    DynamicListModule,
    ManualJournalsModule,
    TrackingCategoriesModule,
    BranchesModule,
    AutoIncrementOrdersModule,
    FeaturesModule,
    BullModule.registerQueue({ name: RECURRING_JOURNALS_QUEUE }),
    BullBoardModule.forFeature({
      name: RECURRING_JOURNALS_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [RecurringJournalsController],
  providers: [
    InjectSystemModel(UserTenant),
    RecurringJournalValidators,
    RecurringJournalDTOTransformer,
    CreateRecurringJournal,
    EditRecurringJournal,
    DeleteRecurringJournal,
    PauseRecurringJournal,
    ResumeRecurringJournal,
    GenerateRecurringJournal,
    GenerateDueRecurringJournals,
    GetRecurringJournals,
    GetRecurringJournal,
    GetRecurringJournalJournals,
    RecurringJournalsQueue,
    ScanRecurringJournals,
    RecurringJournalsBootstrap,
    RecurringJournalsProcessor,
    RecurringJournalsFeatureGuard,
    RecurringJournalsApplication,
  ],
})
export class RecurringJournalsModule {}
