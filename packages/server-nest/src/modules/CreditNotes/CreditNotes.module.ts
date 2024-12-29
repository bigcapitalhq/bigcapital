import { Module } from '@nestjs/common';
import { CreateCreditNoteService } from './commands/CreateCreditNote.service';
import { CommandCreditNoteDTOTransform } from './commands/CommandCreditNoteDTOTransform.service';
import { CreateRefundCreditNoteService } from './commands/CreateRefundCreditNote.service';
import { EditCreditNoteService } from './commands/EditCreditNote.service';
import { OpenCreditNoteService } from './commands/OpenCreditNote.service';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';
import { CreditNoteApplySyncCredit } from './commands/CreditNoteApplySyncCredit.service';
import { DeleteCustomerLinkedCreditNoteService } from './commands/DeleteCustomerLinkedCreditNote.service';
import { CreditNoteAutoIncrementService } from './commands/CreditNoteAutoIncrement.service';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import { CreditNotesController } from './CreditNotes.controller';

@Module({
  providers: [
    CreateCreditNoteService,
    CommandCreditNoteDTOTransform,
    CreateRefundCreditNoteService,
    EditCreditNoteService,
    OpenCreditNoteService,
    DeleteCreditNoteService,
    CreditNoteApplySyncCredit,
    DeleteCustomerLinkedCreditNoteService,
    CreditNoteAutoIncrementService,
    CreditNoteApplication
  ],
  controllers: [CreditNotesController],
})
export class CreditNotesModule {}
