import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { FeaturesModule } from '../Features/Features.module';
import { TrackingCategoriesController } from './TrackingCategories.controller';
import { TrackingCategoriesApplication } from './TrackingCategoriesApplication.service';
import { CreateTrackingCategoryService } from './commands/CreateTrackingCategory.service';
import { EditTrackingCategoryService } from './commands/EditTrackingCategory.service';
import { DeleteTrackingCategoryService } from './commands/DeleteTrackingCategory.service';
import { CommandTrackingCategoryValidator } from './commands/CommandTrackingCategoryValidator.service';
import { GetTrackingCategoriesService } from './queries/GetTrackingCategories.service';
import { GetTrackingCategoryService } from './queries/GetTrackingCategory.service';
import { TrackingCategory } from './models/TrackingCategory';
import { TrackingCategoryOption } from './models/TrackingCategoryOption';
import { ManualJournalEntryTrackingCategory } from './models/ManualJournalEntryTrackingCategory';
import { AccountTransactionTrackingCategory } from './models/AccountTransactionTrackingCategory';
import { TrackingCategoriesFeatureGuard } from './TrackingCategoriesFeatureGuard';

const models = [
  RegisterTenancyModel(TrackingCategory),
  RegisterTenancyModel(TrackingCategoryOption),
  RegisterTenancyModel(ManualJournalEntryTrackingCategory),
  RegisterTenancyModel(AccountTransactionTrackingCategory),
];

@Module({
  imports: [TenancyModule, TenancyDatabaseModule, FeaturesModule, ...models],
  controllers: [TrackingCategoriesController],
  providers: [
    TrackingCategoriesApplication,
    CreateTrackingCategoryService,
    EditTrackingCategoryService,
    DeleteTrackingCategoryService,
    CommandTrackingCategoryValidator,
    GetTrackingCategoriesService,
    GetTrackingCategoryService,
    TrackingCategoriesFeatureGuard,
  ],
  exports: [CommandTrackingCategoryValidator, ...models],
})
export class TrackingCategoriesModule {}
