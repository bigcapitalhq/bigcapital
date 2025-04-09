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
import { ImportableResources } from './ImportableResources';
import { ResourceModule } from '../Resource/Resource.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { AccountsModule } from '../Accounts/Accounts.module';

@Module({
  imports: [ResourceModule, TenancyModule, AccountsModule],
  providers: [
    ImportAls,
    ImportSampleService,
    ImportableResources,
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
  ],
  exports: [ImportAls],
})
export class ImportModule {}
