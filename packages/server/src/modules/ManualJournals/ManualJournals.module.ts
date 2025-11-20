import { Module } from '@nestjs/common';
import { CreateManualJournalService } from './commands/CreateManualJournal.service';
import { EditManualJournal } from './commands/EditManualJournal.service';
import { DeleteManualJournalService } from './commands/DeleteManualJournal.service';
import { PublishManualJournal } from './commands/PublishManualJournal.service';
import { CommandManualJournalValidators } from './commands/CommandManualJournalValidators.service';
import { AutoIncrementManualJournal } from './commands/AutoIncrementManualJournal.service';
import { ManualJournalBranchesDTOTransformer } from '../Branches/integrations/ManualJournals/ManualJournalDTOTransformer.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { AutoIncrementOrdersService } from '../AutoIncrementOrders/AutoIncrementOrders.service';
import { BranchesModule } from '../Branches/Branches.module';
import { ManualJournalsController } from './ManualJournals.controller';
import { ManualJournalsApplication } from './ManualJournalsApplication.service';
import { GetManualJournal } from './queries/GetManualJournal.service';
import { ManualJournalWriteGLSubscriber } from './commands/ManualJournalGLEntriesSubscriber';
import { ManualJournalGLEntries } from './commands/ManualJournalGLEntries';
import { LedgerModule } from '../Ledger/Ledger.module';
import { ManualJournalsExportable } from './commands/ManualJournalExportable';
import { ManualJournalImportable } from './commands/ManualJournalsImport';
import { GetManualJournals } from './queries/GetManualJournals.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { BulkDeleteManualJournalsService } from './BulkDeleteManualJournals.service';
import { ValidateBulkDeleteManualJournalsService } from './ValidateBulkDeleteManualJournals.service';

@Module({
  imports: [BranchesModule, LedgerModule, DynamicListModule],
  controllers: [ManualJournalsController],
  providers: [
    TenancyContext,
    CreateManualJournalService,
    EditManualJournal,
    DeleteManualJournalService,
    PublishManualJournal,
    CommandManualJournalValidators,
    AutoIncrementManualJournal,
    CommandManualJournalValidators,
    ManualJournalBranchesDTOTransformer,
    AutoIncrementOrdersService,
    ManualJournalsApplication,
    GetManualJournal,
    GetManualJournals,
    ManualJournalGLEntries,
    ManualJournalWriteGLSubscriber,
    ManualJournalsExportable,
    ManualJournalImportable,
    BulkDeleteManualJournalsService,
    ValidateBulkDeleteManualJournalsService,
  ],
  exports: [ManualJournalsExportable, ManualJournalImportable],
})
export class ManualJournalsModule {}
