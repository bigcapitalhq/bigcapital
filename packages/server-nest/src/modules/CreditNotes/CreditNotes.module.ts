import { Module } from '@nestjs/common';
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
import { ItemsModule } from '../Items/items.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { GetCreditNote } from './queries/GetCreditNote.service';
import { CreditNoteBrandingTemplate } from './queries/CreditNoteBrandingTemplate.service';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import CreditNoteGLEntries from './commands/CreditNoteGLEntries';
import CreditNoteGLEntriesSubscriber from './subscribers/CreditNoteGLEntriesSubscriber';

@Module({
  imports: [
    ItemsModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    AutoIncrementOrdersModule
  ],
  providers: [
    CreateCreditNoteService,
    GetCreditNote,
    CommandCreditNoteDTOTransform,
    EditCreditNoteService,
    OpenCreditNoteService,
    DeleteCreditNoteService,
    GetCreditNotePdf,
    CreditNoteAutoIncrementService,
    GetCreditNoteState,
    CreditNoteApplication,
    CreditNoteBrandingTemplate,
    CreditNoteGLEntries,
    CreditNoteGLEntriesSubscriber
  ],
  exports: [
    CreateCreditNoteService,
    GetCreditNote,
    CommandCreditNoteDTOTransform, 
    EditCreditNoteService,
    OpenCreditNoteService,
    DeleteCreditNoteService,
    GetCreditNotePdf,
    CreditNoteAutoIncrementService,
    GetCreditNoteState,
    CreditNoteApplication,
    CreditNoteBrandingTemplate
  ],
  controllers: [CreditNotesController],
})
export class CreditNotesModule {}
