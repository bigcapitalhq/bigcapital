import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { ApproveSaleEstimateService } from './commands/ApproveSaleEstimate.service';
import { ConvertSaleEstimate } from './commands/ConvetSaleEstimate.service';
import { CreateSaleEstimate } from './commands/CreateSaleEstimate.service';
import { DeliverSaleEstimateService } from './commands/DeliverSaleEstimate.service';
import { EditSaleEstimate } from './commands/EditSaleEstimate.service';
import { RejectSaleEstimateService } from './commands/RejectSaleEstimate.service';
import { SaleEstimateValidators } from './commands/SaleEstimateValidators.service';
import { SaleEstimatesController } from './SaleEstimates.controller';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { SaleEstimateDTOTransformer } from './commands/SaleEstimateDTOTransformer.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { WarehouseTransactionDTOTransform } from '../Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { SaleEstimateIncrement } from './commands/SaleEstimateIncrement.service';
import { AutoIncrementOrdersService } from '../AutoIncrementOrders/AutoIncrementOrders.service';
import { BrandingTemplateDTOTransformer } from '../PdfTemplate/BrandingTemplateDTOTransformer';
import { SaleEstimatesApplication } from './SaleEstimates.application';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';
import { GetSaleEstimate } from './queries/GetSaleEstimate.service';
import { GetSaleEstimateState } from './queries/GetSaleEstimateState.service';
import { SendSaleEstimateMail } from './commands/SendSaleEstimateMail';
import { GetSaleEstimatesService } from './queries/GetSaleEstimates.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { GetSaleEstimatePdf } from './queries/GetSaleEstimatePdf';
import { MailNotificationModule } from '../MailNotification/MailNotification.module';
import { MailModule } from '../Mail/Mail.module';
import { SMSModule } from '../SMS/SMS.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { SaleEstimateSmsNotification } from './SaleEstimateSmsNotification';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { SaleEstimatePdfTemplate } from '../SaleInvoices/queries/SaleEstimatePdfTemplate.service';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { SendSaleEstimateMailQueue } from './types/SaleEstimates.types';
import { SMS_QUEUE } from '../SMS/SMS.constants';
import { SaleEstimatesExportable } from './SaleEstimatesExportable';
import { SaleEstimatesImportable } from './SaleEstimatesImportable';
import { GetSaleEstimateMailStateService } from './queries/GetSaleEstimateMailState.service';
import { GetSaleEstimateMailTemplateService } from './queries/GetSaleEstimateMailTemplate.service';
import { SaleEstimateAutoIncrementSubscriber } from './subscribers/SaleEstimateAutoIncrementSubscriber';
import { SaleEstimateSmsNotificationSubscriber } from './subscribers/SaleEstimateSmsNotificationSubscriber';
import { BulkDeleteSaleEstimatesService } from './BulkDeleteSaleEstimates.service';
import { ValidateBulkDeleteSaleEstimatesService } from './ValidateBulkDeleteSaleEstimates.service';
import { SendSaleEstimateMailProcess } from './processes/SendSaleEstimateMail.process';

@Module({
  imports: [
    TenancyModule,
    TenancyDatabaseModule,
    DynamicListModule,
    MailNotificationModule,
    MailModule,
    SMSModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    PdfTemplatesModule,
    BullModule.registerQueue({ name: SMS_QUEUE }),
    BullModule.registerQueue({ name: SendSaleEstimateMailQueue }),
    BullBoardModule.forFeature({
      name: SendSaleEstimateMailQueue,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [SaleEstimatesController],
  providers: [
    AutoIncrementOrdersService,
    BrandingTemplateDTOTransformer,
    SaleEstimateIncrement,
    CreateSaleEstimate,
    ConvertSaleEstimate,
    EditSaleEstimate,
    DeleteSaleEstimate,
    GetSaleEstimate,
    GetSaleEstimatesService,
    GetSaleEstimateState,
    ApproveSaleEstimateService,
    DeliverSaleEstimateService,
    RejectSaleEstimateService,
    SaleEstimateValidators,
    ItemsEntriesService,
    BranchesSettingsService,
    WarehousesSettings,
    BranchTransactionDTOTransformer,
    WarehouseTransactionDTOTransform,
    SaleEstimateDTOTransformer,
    SaleEstimatesApplication,
    SaleEstimateSmsNotification,
    SendSaleEstimateMail,
    GetSaleEstimatePdf,
    SaleEstimatePdfTemplate,
    SaleEstimatesExportable,
    SaleEstimatesImportable,
    GetSaleEstimateMailStateService,
    GetSaleEstimateMailTemplateService,
    SaleEstimateAutoIncrementSubscriber,
    SaleEstimateSmsNotificationSubscriber,
    BulkDeleteSaleEstimatesService,
    ValidateBulkDeleteSaleEstimatesService,
    SendSaleEstimateMailProcess,
  ],
  exports: [
    SaleEstimatesExportable,
    SaleEstimatesImportable,
    GetSaleEstimateMailStateService,
    GetSaleEstimateMailTemplateService,
  ],
})
export class SaleEstimatesModule {}
