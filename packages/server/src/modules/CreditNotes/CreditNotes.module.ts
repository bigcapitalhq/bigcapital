import { forwardRef, Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    forwardRef(() => CreditNoteRefundsModule),
    forwardRef(() => CreditNotesApplyInvoiceModule)
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
  ],
  controllers: [CreditNotesController],
})
export class CreditNotesModule { }
