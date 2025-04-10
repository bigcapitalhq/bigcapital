import { Exportable } from '../../Export/Exportable';
import { EXPORT_SIZE_LIMIT } from '../../Export/constants';
import { Injectable } from '@nestjs/common';
import { IManualJournalsFilter } from '../types/ManualJournals.types';
import { ManualJournalsApplication } from '../ManualJournalsApplication.service';
import { ExportableService } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ManualJournal } from '../models/ManualJournal';

@Injectable()
@ExportableService({ name: ManualJournal.name })
export class ManualJournalsExportable extends Exportable {
  constructor(
    private readonly manualJournalsApplication: ManualJournalsApplication,
  ) {
    super();
  }

  /**
   * Retrieves the manual journals data to exportable sheet.
   * @param {IManualJournalsFilter} query - 
   */
  public exportable(query: IManualJournalsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IManualJournalsFilter;

    return this.manualJournalsApplication
      .getManualJournals(parsedQuery)
      .then((output) => output.manualJournals);
  }
}
