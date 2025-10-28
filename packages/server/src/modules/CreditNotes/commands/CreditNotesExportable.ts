import { Exportable } from '@/modules/Export/Exportable';
import { CreditNoteApplication } from '../CreditNoteApplication.service';
import { Injectable } from '@nestjs/common';
import { ICreditNotesQueryDTO } from '../types/CreditNotes.types';
import { ExportableService } from '@/modules/Export/decorators/ExportableModel.decorator';
import { CreditNote } from '../models/CreditNote';

@Injectable()
@ExportableService({ name: CreditNote.name })
export class CreditNotesExportable extends Exportable {
  constructor(private readonly creditNotesApp: CreditNoteApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {IVendorCreditsQueryDTO} query -
   */
  public exportable(query: ICreditNotesQueryDTO) {
    const filterQuery = (query) => {
      query.withGraphFetched('branch');
      query.withGraphFetched('warehouse');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: 12000,
      filterQuery,
    } as ICreditNotesQueryDTO;

    return this.creditNotesApp
      .getCreditNotes(parsedQuery)
      .then((output) => output.creditNotes);
  }
}
