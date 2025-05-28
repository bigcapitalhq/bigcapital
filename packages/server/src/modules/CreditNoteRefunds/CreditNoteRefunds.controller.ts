import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ICreditNoteRefundDTO } from '../CreditNotes/types/CreditNotes.types';
import { CreditNotesRefundsApplication } from './CreditNotesRefundsApplication.service';
import { RefundCreditNote } from './models/RefundCreditNote';
import { CreditNoteRefundDto } from './dto/CreditNoteRefund.dto';

@Controller('credit-notes')
@ApiTags('credit-notes-refunds')
export class CreditNoteRefundsController {
  constructor(
    private readonly creditNotesRefundsApplication: CreditNotesRefundsApplication,
  ) {}

  @Get(':creditNoteId/refunds')
  @ApiOperation({ summary: 'Retrieve the credit note graph.' })
  getCreditNoteRefunds(@Param('creditNoteId') creditNoteId: number) {
    return this.creditNotesRefundsApplication.getCreditNoteRefunds(
      creditNoteId,
    );
  }

  /**
   * Create a refund credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {ICreditNoteRefundDTO} creditNoteDTO - The credit note DTO.
   * @returns {Promise<RefundCreditNote>}
   */
  @Post(':creditNoteId/refunds')
  @ApiOperation({ summary: 'Create a refund for the given credit note.' })
  createRefundCreditNote(
    @Param('creditNoteId') creditNoteId: number,
    @Body() creditNoteDTO: CreditNoteRefundDto,
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
  @ApiOperation({ summary: 'Delete a refund for the given credit note.' })
  deleteRefundCreditNote(
    @Param('refundCreditId') refundCreditId: number,
  ): Promise<void> {
    return this.creditNotesRefundsApplication.deleteRefundCreditNote(
      refundCreditId,
    );
  }
}
