import { Injectable } from '@nestjs/common';
import { ICreditNoteRefundDTO } from '../CreditNotes/types/CreditNotes.types';
import { CreateRefundCreditNoteService } from './commands/CreateRefundCreditNote.service';
import { DeleteRefundCreditNoteService } from './commands/DeleteRefundCreditNote.service';
import { RefundCreditNoteService } from './commands/RefundCreditNote.service';
import { RefundSyncCreditNoteBalanceService } from './commands/RefundSyncCreditNoteBalance';
import { CreditNoteRefundDto } from './dto/CreditNoteRefund.dto';
import { GetCreditNoteRefundsService } from './queries/GetCreditNoteRefunds.service';

@Injectable()
export class CreditNotesRefundsApplication {
  constructor(
    private readonly createRefundCreditNoteService: CreateRefundCreditNoteService,
    private readonly deleteRefundCreditNoteService: DeleteRefundCreditNoteService,
    private readonly getCreditNoteRefundsService: GetCreditNoteRefundsService,
    private readonly refundCreditNoteService: RefundCreditNoteService,
    private readonly refundSyncCreditNoteBalanceService: RefundSyncCreditNoteBalanceService,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<IRefundCreditNotePOJO[]>}
   */
  public getCreditNoteRefunds(creditNoteId: number) {
    return this.getCreditNoteRefundsService.getCreditNoteRefunds(creditNoteId);
  }

  /**
   * Create a refund credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {CreditNoteRefundDto} creditNoteDTO - The credit note DTO.
   * @returns {Promise<RefundCreditNote>}
   */
  public createRefundCreditNote(
    creditNoteId: number,
    creditNoteDTO: CreditNoteRefundDto,
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
