import { Module } from '@nestjs/common';
import { ImportAls } from './ImportALS';
import { ImportSampleService } from './ImportSample';
import { ImportResourceApplication } from './ImportResourceApplication';
import { ImportDeleteExpiredFiles } from './ImportRemoveExpiredFiles';
import { ImportFileUploadService } from './ImportFileUpload';
import { ImportFileProcessCommit } from './ImportFileProcessCommit';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportFilePreview } from './ImportFilePreview';
import { ImportFileMeta } from './ImportFileMeta';
import { ImportFileMapping } from './ImportFileMapping';
import { ImportFileDataValidator } from './ImportFileDataValidator';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import { ImportFileCommon } from './ImportFileCommon';
import { ResourceModule } from '../Resource/Resource.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { ImportController } from './Import.controller';
import { ImportableRegistry } from './ImportableRegistry';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { ImportModel } from './models/Import';
import { ImportDeleteExpiredFilesJobs } from './jobs/ImportDeleteExpiredFilesJob';

const models = [InjectSystemModel(ImportModel)];

@Module({
  imports: [ResourceModule, TenancyModule, AccountsModule],
  providers: [
    ...models,
    ImportAls,
    ImportSampleService,
    ImportResourceApplication,
    ImportDeleteExpiredFiles,
    ImportFileUploadService,
    ImportFileProcessCommit,
    ImportFileProcess,
    ImportFilePreview,
    ImportFileMeta,
    ImportFileMapping,
    ImportFileDataValidator,
    ImportFileDataTransformer,
    ImportFileCommon,
    ImportableRegistry,
    ImportDeleteExpiredFilesJobs
  ],
  controllers: [ImportController],
  exports: [ImportAls, ...models],
})
export class ImportModule {}
