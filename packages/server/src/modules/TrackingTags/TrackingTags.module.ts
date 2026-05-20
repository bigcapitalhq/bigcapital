import { Module } from '@nestjs/common';
import { TrackingTagsController } from './TrackingTags.controller';
import { TrackingTagsApplication } from './TrackingTags.application';
import { CreateTrackingTagService } from './commands/CreateTrackingTag.service';
import { EditTrackingTagService } from './commands/EditTrackingTag.service';
import { DeleteTrackingTagService } from './commands/DeleteTrackingTag.service';
import { GetTrackingTagsService } from './queries/GetTrackingTags.service';
import { GetTrackingTagService } from './queries/GetTrackingTag.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { TrackingTag } from './models/TrackingTag';
import { TrackingTagOption } from './models/TrackingTagOption';
import { ItemEntryTrackingTag } from './models/ItemEntryTrackingTag';
import { ManualJournalEntryTrackingTag } from './models/ManualJournalEntryTrackingTag';
import { AccountTransactionTrackingTag } from './models/AccountTransactionTrackingTag';

const models = [
  RegisterTenancyModel(TrackingTag),
  RegisterTenancyModel(TrackingTagOption),
  RegisterTenancyModel(ItemEntryTrackingTag),
  RegisterTenancyModel(ManualJournalEntryTrackingTag),
  RegisterTenancyModel(AccountTransactionTrackingTag),
];

@Module({
  imports: [...models],
  controllers: [TrackingTagsController],
  providers: [
    TrackingTagsApplication,
    CreateTrackingTagService,
    EditTrackingTagService,
    DeleteTrackingTagService,
    GetTrackingTagsService,
    GetTrackingTagService,
  ],
  exports: [
    GetTrackingTagsService,
    GetTrackingTagService,
    ...models,
  ],
})
export class TrackingTagsModule {}
