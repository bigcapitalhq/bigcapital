import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import {
  ICreditNoteEditDTO,
  ICreditNoteNewDTO,
  ICreditNoteRefundDTO,
} from './types/CreditNotes.types';

@Controller('credit-notes')
export class CreditNotesController {
  /**
   * @param {CreditNoteApplication} creditNoteApplication - The credit note application service.
   */
  constructor(private creditNoteApplication: CreditNoteApplication) {}

  @Post()
  createCreditNote(@Body() creditNoteDTO: ICreditNoteNewDTO) {
    return this.creditNoteApplication.createCreditNote(creditNoteDTO);
  }

  @Put(':id')
  editCreditNote(
    @Param('id') creditNoteId: number,
    @Body() creditNoteDTO: ICreditNoteEditDTO,
  ) {
    return this.creditNoteApplication.editCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  @Post(':id/open')
  openCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.openCreditNote(creditNoteId);
  }

  @Delete(':id')
  deleteCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.deleteCreditNote(creditNoteId);
  }

  @Post(':id/refund')
  createRefundCreditNote(
    @Param('id') creditNoteId: number,
    @Body() creditNoteDTO: ICreditNoteRefundDTO,
  ) {
    return this.creditNoteApplication.createRefundCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }
}
