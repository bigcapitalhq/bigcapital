import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ICreditNoteRefundDTO } from '../CreditNotes/types/CreditNotes.types';
import { CreditNotesRefundsApplication } from './CreditNotesRefundsApplication.service';
import { RefundCreditNote } from './models/RefundCreditNote';

@Controller('credit-notes')
export class CreditNoteRefundsController {
  constructor(
    private readonly creditNotesRefundsApplication: CreditNotesRefundsApplication,
  ) {}

  /**
   * Create a refund credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {ICreditNoteRefundDTO} creditNoteDTO - The credit note DTO.
   * @returns {Promise<RefundCreditNote>}
   */
  @Post(':creditNoteId/refunds')
  createRefundCreditNote(
    @Param('creditNoteId') creditNoteId: number,
    @Body() creditNoteDTO: ICreditNoteRefundDTO,
  ): Promise<RefundCreditNote> {
    return this.creditNotesRefundsApplication.createRefundCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  /**
   * Delete a refund credit note.
   * @param {number} refundCreditId - The refund credit ID.
   * @returns {Promise<void>}
   */
  @Delete('refunds/:refundCreditId')
  deleteRefundCreditNote(
    @Param('refundCreditId') refundCreditId: number,
  ): Promise<void> {
    return this.creditNotesRefundsApplication.deleteRefundCreditNote(
      refundCreditId,
    );
  }
}
