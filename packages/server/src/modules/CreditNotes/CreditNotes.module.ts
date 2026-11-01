import { forwardRef, Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { CreateCreditNoteService } from './commands/CreateCreditNote.service';
import { CommandCreditNoteDTOTransform } from './commands/CommandCreditNoteDTOTransform.service';
import { EditCreditNoteService } from './commands/EditCreditNote.service';
import { OpenCreditNoteService } from './commands/OpenCreditNote.service';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';
import { CreditNoteAutoIncrementService } from './commands/CreditNoteAutoIncrement.service';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import { CreditNotesController } from './CreditNotes.controller';
import { GetCreditNoteState } from './queries/GetCreditNoteState.service';
import { GetCreditNotePdf } from './queries/GetCreditNotePdf.serivce';
import { ItemsModule } from '../Items/Items.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { GetCreditNoteService } from './queries/GetCreditNote.service';
import { CreditNoteBrandingTemplate } from './queries/CreditNoteBrandingTemplate.service';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { CreditNoteGLEntries } from './commands/CreditNoteGLEntries';
import { CreditNoteGLEntriesSubscriber } from './subscribers/CreditNoteGLEntriesSubscriber';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { GetCreditNotesService } from './queries/GetCreditNotes.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { CreditNotesExportable } from './commands/CreditNotesExportable';
import { CreditNotesImportable } from './commands/CreditNotesImportable';
import { CreditNoteInventoryTransactionsSubscriber } from './subscribers/CreditNoteInventoryTransactionsSubscriber';
import { RefundSyncCreditNoteBalanceSubscriber } from './subscribers/RefundSyncCreditNoteBalanceSubscriber';
import { DeleteCustomerLinkedCreditSubscriber } from './subscribers/DeleteCustomerLinkedCreditSubscriber';
import { CreditNoteAutoSerialSubscriber } from './subscribers/CreditNoteAutoSerialSubscriber';
import { CreditNoteInventoryTransactions } from './commands/CreditNotesInventoryTransactions';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { CreditNoteRefundsModule } from '../CreditNoteRefunds/CreditNoteRefunds.module';
import { CreditNotesApplyInvoiceModule } from '../CreditNotesApplyInvoice/CreditNotesApplyInvoice.module';
import { BulkDeleteCreditNotesService } from './BulkDeleteCreditNotes.service';
import { ValidateBulkDeleteCreditNotesService } from './ValidateBulkDeleteCreditNotes.service';
import { SendCreditNoteMail } from './commands/SendCreditNoteMail';
import { GetCreditNoteMailStateService } from './queries/GetCreditNoteMailState.service';
import { GetCreditNoteMailTemplateService } from './queries/GetCreditNoteMailTemplate.service';
import { SendCreditNoteMailProcessor } from './processors/SendCreditNoteMail.processor';
import { MailNotificationModule } from '../MailNotification/MailNotification.module';
import { MailModule } from '../Mail/Mail.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { SendCreditNoteMailQueue } from './types/CreditNotes.types';

@Module({
  imports: [
    TenancyModule,
    ItemsModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    AutoIncrementOrdersModule,
    LedgerModule,
    AccountsModule,
    DynamicListModule,
    InventoryCostModule,
    MailNotificationModule,
    MailModule,
    forwardRef(() => CreditNoteRefundsModule),
    forwardRef(() => CreditNotesApplyInvoiceModule),
    BullModule.registerQueue({ name: SendCreditNoteMailQueue }),
    BullBoardModule.forFeature({
      name: SendCreditNoteMailQueue,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [
    CreateCreditNoteService,
    GetCreditNoteService,
    CommandCreditNoteDTOTransform,
    EditCreditNoteService,
    OpenCreditNoteService,
    DeleteCreditNoteService,
    GetCreditNotePdf,
    GetCreditNotesService,
    CreditNoteAutoIncrementService,
    GetCreditNoteState,
    CreditNoteApplication,
    CreditNoteBrandingTemplate,
    CreditNoteGLEntries,
    CreditNoteGLEntriesSubscriber,
    CreditNotesExportable,
    CreditNotesImportable,
    CreditNoteInventoryTransactions,
    CreditNoteInventoryTransactionsSubscriber,
    RefundSyncCreditNoteBalanceSubscriber,
    DeleteCustomerLinkedCreditSubscriber,
    CreditNoteAutoSerialSubscriber,
    BulkDeleteCreditNotesService,
    ValidateBulkDeleteCreditNotesService,
    SendCreditNoteMail,
    GetCreditNoteMailStateService,
    GetCreditNoteMailTemplateService,
    SendCreditNoteMailProcessor,
  ],
  exports: [
    CreateCreditNoteService,
    GetCreditNoteService,
    CommandCreditNoteDTOTransform,
    EditCreditNoteService,
    OpenCreditNoteService,
    DeleteCreditNoteService,
    GetCreditNotePdf,
    CreditNoteAutoIncrementService,
    GetCreditNoteState,
    CreditNoteApplication,
    CreditNoteBrandingTemplate,
    CreditNotesExportable,
    CreditNotesImportable,
    GetCreditNoteMailStateService,
    GetCreditNoteMailTemplateService,
  ],
  controllers: [CreditNotesController],
})
export class CreditNotesModule {}
