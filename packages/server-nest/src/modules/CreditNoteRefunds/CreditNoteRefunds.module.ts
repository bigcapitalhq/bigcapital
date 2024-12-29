import { Module } from '@nestjs/common';
import { CreateRefundCreditNoteService } from './commands/CreateRefundCreditNote.service';
import { DeleteRefundCreditNoteService } from './commands/DeleteRefundCreditNote.service';
import { RefundCreditNoteService } from './commands/RefundCreditNote.service';
import { RefundSyncCreditNoteBalanceService } from './commands/RefundSyncCreditNoteBalance';
import { CreditNotesRefundsApplication } from './CreditNotesRefundsApplication.service';
import { CreditNoteRefundsController } from './CreditNoteRefunds.controller';
import { CreditNotesModule } from '../CreditNotes/CreditNotes.module';

@Module({
  imports: [CreditNotesModule],
  providers: [
    CreateRefundCreditNoteService,
    DeleteRefundCreditNoteService,
    RefundCreditNoteService,
    RefundSyncCreditNoteBalanceService,
    CreditNotesRefundsApplication,
  ],
  controllers: [CreditNoteRefundsController],
})
export class CreditNoteRefundsModule {}
