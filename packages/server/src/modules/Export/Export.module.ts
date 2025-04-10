import { Module } from '@nestjs/common';
import { ExportController } from './Export.controller';
import { ExportResourceService } from './ExportService';
import { ExportPdf } from './ExportPdf';
import { ExportAls } from './ExportAls';
import { ExportApplication } from './ExportApplication';
import { ResourceModule } from '../Resource/Resource.module';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { ImportModel } from '../Import/models/Import';
import { ExportableRegistry } from './ExportRegistery';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { AccountsModule } from '../Accounts/Accounts.module';

const models = [RegisterTenancyModel(ImportModel)];

@Module({
  imports: [
    ...models,
    ResourceModule,
    TemplateInjectableModule,
    ChromiumlyTenancyModule,
    AccountsModule
  ],
  providers: [
    ExportResourceService,
    ExportPdf,
    ExportAls,
    ExportApplication,
    ExportableRegistry
  ],
  exports: [...models],
  controllers: [ExportController],
})
export class ExportModule {}
