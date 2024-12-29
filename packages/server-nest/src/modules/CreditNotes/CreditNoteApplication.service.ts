import { Injectable } from '@nestjs/common';
import { CreateCreditNoteService } from './commands/CreateCreditNote.service';
import { CreateRefundCreditNoteService } from './commands/CreateRefundCreditNote.service';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';
import { EditCreditNoteService } from './commands/EditCreditNote.service';
import { OpenCreditNoteService } from './commands/OpenCreditNote.service';
import { GetCreditNotePdf } from './queries/GetCreditNotePdf.serivce';
import {
  ICreditNoteEditDTO,
  ICreditNoteNewDTO,
  ICreditNoteRefundDTO,
} from './types/CreditNotes.types';

@Injectable()
export class CreditNoteApplication {
  constructor(
    private createCreditNoteService: CreateCreditNoteService,
    private createRefundCreditNoteService: CreateRefundCreditNoteService,
    private editCreditNoteService: EditCreditNoteService,
    private openCreditNoteService: OpenCreditNoteService,
    private deleteCreditNoteService: DeleteCreditNoteService,
    private getCreditNotePdfService: GetCreditNotePdf,
  ) {}

  createCreditNote(creditNoteDTO: ICreditNoteNewDTO) {
    return this.createCreditNoteService.creditCreditNote(creditNoteDTO);
  }

  editCreditNote(creditNoteId: number, creditNoteDTO: ICreditNoteEditDTO) {
    return this.editCreditNoteService.editCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  openCreditNote(creditNoteId: number) {
    return this.openCreditNoteService.openCreditNote(creditNoteId);
  }

  deleteCreditNote(creditNoteId: number) {
    return this.deleteCreditNoteService.deleteCreditNote(creditNoteId);
  }

  createRefundCreditNote(
    creditNoteId: number,
    creditNoteDTO: ICreditNoteRefundDTO,
  ) {
    return this.createRefundCreditNoteService.createCreditNoteRefund(
      creditNoteId,
      creditNoteDTO,
    );
  }

  getCreditNotePdf(creditNoteId: number) {
    return this.getCreditNotePdfService.getCreditNotePdf(creditNoteId);
  }
}
