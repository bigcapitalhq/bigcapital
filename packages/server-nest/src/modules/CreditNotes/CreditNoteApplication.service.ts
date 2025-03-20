import { Injectable } from '@nestjs/common';
import { CreateCreditNoteService } from './commands/CreateCreditNote.service';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';
import { EditCreditNoteService } from './commands/EditCreditNote.service';
import { OpenCreditNoteService } from './commands/OpenCreditNote.service';
import { GetCreditNotePdf } from './queries/GetCreditNotePdf.serivce';
import { ICreditNotesQueryDTO } from './types/CreditNotes.types';
import { GetCreditNotesService } from './queries/GetCreditNotes.service';
import { CreateCreditNoteDto, EditCreditNoteDto } from './dtos/CreditNote.dto';

@Injectable()
export class CreditNoteApplication {
  constructor(
    private readonly createCreditNoteService: CreateCreditNoteService,
    private readonly editCreditNoteService: EditCreditNoteService,
    private readonly openCreditNoteService: OpenCreditNoteService,
    private readonly deleteCreditNoteService: DeleteCreditNoteService,
    private readonly getCreditNotePdfService: GetCreditNotePdf,
    private readonly getCreditNotesService: GetCreditNotesService,
  ) {}

  /**
   * Creates a new credit note.
   * @param {CreateCreditNoteDto} creditNoteDTO
   * @returns {Promise<CreditNote>}
   */
  createCreditNote(creditNoteDTO: CreateCreditNoteDto) {
    return this.createCreditNoteService.creditCreditNote(creditNoteDTO);
  }

  /**
   * Edits a credit note.
   * @param {number} creditNoteId
   * @param {EditCreditNoteDto} creditNoteDTO
   * @returns {Promise<CreditNote>}
   */
  editCreditNote(creditNoteId: number, creditNoteDTO: EditCreditNoteDto) {
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
