import { Injectable } from '@nestjs/common';
import { ICreditNoteRefundDTO } from '../CreditNotes/types/CreditNotes.types';
import { CreateRefundCreditNoteService } from './commands/CreateRefundCreditNote.service';
import { DeleteRefundCreditNoteService } from './commands/DeleteRefundCreditNote.service';
import { RefundCreditNoteService } from './commands/RefundCreditNote.service';
import { RefundSyncCreditNoteBalanceService } from './commands/RefundSyncCreditNoteBalance';

@Injectable()
export class CreditNotesRefundsApplication {
  constructor(
    private readonly createRefundCreditNoteService: CreateRefundCreditNoteService,
    private readonly deleteRefundCreditNoteService: DeleteRefundCreditNoteService,
    private readonly refundCreditNoteService: RefundCreditNoteService,
    private readonly refundSyncCreditNoteBalanceService: RefundSyncCreditNoteBalanceService,
  ) {}

  /**
   * Create a refund credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {ICreditNoteRefundDTO} creditNoteDTO - The credit note DTO.
   * @returns {Promise<RefundCreditNote>}
   */
  public createRefundCreditNote(
    creditNoteId: number,
    creditNoteDTO: ICreditNoteRefundDTO,
  ) {
    return this.createRefundCreditNoteService.createCreditNoteRefund(
      creditNoteId,
      creditNoteDTO,
    );
  }

  /**
   * Delete a refund credit note.
   * @param {number} refundCreditId - The refund credit ID.
   * @returns {Promise<void>}
   */
  public deleteRefundCreditNote(refundCreditId: number) {
    return this.deleteRefundCreditNoteService.deleteCreditNoteRefund(
      refundCreditId,
    );
  }
}
