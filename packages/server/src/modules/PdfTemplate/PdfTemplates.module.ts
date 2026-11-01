import { Module } from '@nestjs/common';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AssignPdfTemplateDefaultService } from './commands/AssignPdfTemplateDefault.service';
import { CreatePdfTemplateService } from './commands/CreatePdfTemplate.service';
import { DeletePdfTemplateService } from './commands/DeletePdfTemplate.service';
import { EditPdfTemplateService } from './commands/EditPdfTemplate.service';
import { PdfTemplateApplication } from './PdfTemplate.application';
import { PdfTemplatesController } from './PdfTemplates.controller';
import { GetPdfTemplateService } from './queries/GetPdfTemplate.service';
import { BrandingTemplateDTOTransformer } from './BrandingTemplateDTOTransformer';
import { GetOrganizationBrandingAttributesService } from './queries/GetOrganizationBrandingAttributes.service';
import { GetPdfTemplates } from './queries/GetPdfTemplates.service';
import { GetPdfTemplateBrandingState } from './queries/GetPdfTemplateBrandingState.service';
import { AttachmentsModule } from '../Attachments/Attachment.module';

@Module({
  exports: [
    GetPdfTemplateService,
    BrandingTemplateDTOTransformer,
    GetOrganizationBrandingAttributesService,
  ],
  imports: [TenancyModule, TenancyDatabaseModule, AttachmentsModule],
  controllers: [PdfTemplatesController],
  providers: [
    PdfTemplateApplication,
    CreatePdfTemplateService,
    DeletePdfTemplateService,
    GetPdfTemplateService,
    GetPdfTemplates,
    EditPdfTemplateService,
    AssignPdfTemplateDefaultService,
    BrandingTemplateDTOTransformer,
    GetOrganizationBrandingAttributesService,
    GetPdfTemplateBrandingState,
  ],
})
export class PdfTemplatesModule {}
