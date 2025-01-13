import { Injectable } from '@nestjs/common';
import { CreateCreditNoteService } from './commands/CreateCreditNote.service';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';
import { EditCreditNoteService } from './commands/EditCreditNote.service';
import { OpenCreditNoteService } from './commands/OpenCreditNote.service';
import { GetCreditNotePdf } from './queries/GetCreditNotePdf.serivce';
import {
  ICreditNoteEditDTO,
  ICreditNoteNewDTO,
  ICreditNotesQueryDTO,
} from './types/CreditNotes.types';
import { GetCreditNotesService } from './queries/GetCreditNotes.service';

@Injectable()
export class CreditNoteApplication {
  constructor(
    private createCreditNoteService: CreateCreditNoteService,
    private editCreditNoteService: EditCreditNoteService,
    private openCreditNoteService: OpenCreditNoteService,
    private deleteCreditNoteService: DeleteCreditNoteService,
    private getCreditNotePdfService: GetCreditNotePdf,
    private getCreditNotesService: GetCreditNotesService,
  ) {}

  /**
   * Creates a new credit note.
   * @param {ICreditNoteNewDTO} creditNoteDTO
   * @returns {Promise<CreditNote>}
   */
  createCreditNote(creditNoteDTO: ICreditNoteNewDTO) {
    return this.createCreditNoteService.creditCreditNote(creditNoteDTO);
  }

  /**
   * Edits a credit note.
   * @param {number} creditNoteId
   * @param {ICreditNoteEditDTO} creditNoteDTO
   * @returns {Promise<CreditNote>}
   */
  editCreditNote(creditNoteId: number, creditNoteDTO: ICreditNoteEditDTO) {
    return this.editCreditNoteService.editCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  /**
   * Opens a credit note.
   * @param {number} creditNoteId
   * @returns {Promise<CreditNote>}
   */
  openCreditNote(creditNoteId: number) {
    return this.openCreditNoteService.openCreditNote(creditNoteId);
  }

  /**
   * Deletes a credit note.
   * @param {number} creditNoteId
   * @returns {Promise<CreditNote>}
   */
  deleteCreditNote(creditNoteId: number) {
    return this.deleteCreditNoteService.deleteCreditNote(creditNoteId);
  }

  /**
   * Retrieves the PDF for a credit note.
   * @param {number} creditNoteId
   * @returns {Promise<string>}
   */
  getCreditNotePdf(creditNoteId: number) {
    return this.getCreditNotePdfService.getCreditNotePdf(creditNoteId);
  }

  /**
   * Retrieves the credit notes list.
   * @param {ICreditNotesQueryDTO} creditNotesQuery
   * @returns {Promise<GetCreditNotesResponse>}
   */
  getCreditNotes(creditNotesQuery: ICreditNotesQueryDTO) {
    return this.getCreditNotesService.getCreditNotesList(creditNotesQuery);
  }
}
