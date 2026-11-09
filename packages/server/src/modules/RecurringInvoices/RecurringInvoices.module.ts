import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { RecurringInvoicesController } from './RecurringInvoices.controller';
import { RecurringInvoicesApplication } from './RecurringInvoices.application';
import { CreateRecurringInvoice } from './commands/CreateRecurringInvoice.service';
import { EditRecurringInvoice } from './commands/EditRecurringInvoice.service';
import { DeleteRecurringInvoice } from './commands/DeleteRecurringInvoice.service';
import { PauseRecurringInvoice } from './commands/PauseRecurringInvoice.service';
import { ResumeRecurringInvoice } from './commands/ResumeRecurringInvoice.service';
import { GenerateRecurringInvoice } from './commands/GenerateRecurringInvoice.service';
import { GenerateDueRecurringInvoices } from './commands/GenerateDueRecurringInvoices.service';
import { RecurringInvoiceDTOTransformer } from './commands/RecurringInvoiceDTOTransformer.service';
import { RecurringInvoiceValidators } from './commands/RecurringInvoiceValidators.service';
import { GetRecurringInvoices } from './queries/GetRecurringInvoices.service';
import { GetRecurringInvoice } from './queries/GetRecurringInvoice.service';
import { GetRecurringInvoiceInvoices } from './queries/GetRecurringInvoiceInvoices.service';
import { GetRecurringInvoiceState } from './queries/GetRecurringInvoiceState.service';
import { RecurringInvoicesQueue } from './services/RecurringInvoicesQueue.service';
import { RecurringInvoicesBootstrap } from './services/RecurringInvoicesBootstrap.service';
import { ScanRecurringInvoices } from './services/ScanRecurringInvoices.service';
import { RecurringInvoicesProcessor } from './processors/RecurringInvoices.processor';
import { RECURRING_INVOICES_QUEUE } from './RecurringInvoice.types';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { UserTenant } from '../System/models/UserTenant.model';

@Module({
  imports: [
    TenancyModule,
    TenancyDatabaseModule,
    DynamicListModule,
    SaleInvoicesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
    BullModule.registerQueue({ name: RECURRING_INVOICES_QUEUE }),
    BullBoardModule.forFeature({
      name: RECURRING_INVOICES_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [RecurringInvoicesController],
  providers: [
    InjectSystemModel(UserTenant),
    ItemsEntriesService,
    WarehousesSettings,
    BranchesSettingsService,
    RecurringInvoiceValidators,
    RecurringInvoiceDTOTransformer,
    CreateRecurringInvoice,
    EditRecurringInvoice,
    DeleteRecurringInvoice,
    PauseRecurringInvoice,
    ResumeRecurringInvoice,
    GenerateRecurringInvoice,
    GenerateDueRecurringInvoices,
    GetRecurringInvoices,
    GetRecurringInvoice,
    GetRecurringInvoiceInvoices,
    GetRecurringInvoiceState,
    RecurringInvoicesQueue,
    RecurringInvoicesBootstrap,
    ScanRecurringInvoices,
    RecurringInvoicesProcessor,
    RecurringInvoicesApplication,
  ],
})
export class RecurringInvoicesModule {}
