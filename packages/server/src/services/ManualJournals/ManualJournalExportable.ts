import { Inject, Service } from 'typedi';
import { IManualJournalsFilter } from '@/interfaces';
import { Exportable } from '../Export/Exportable';
import { ManualJournalsApplication } from './ManualJournalsApplication';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';

@Service()
export class ManualJournalsExportable extends Exportable {
  @Inject()
  private manualJournalsApplication: ManualJournalsApplication;

  /**
   * Retrieves the manual journals data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IManualJournalsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IManualJournalsFilter;

    return this.manualJournalsApplication
      .getManualJournals(tenantId, parsedQuery)
      .then((output) => output.manualJournals);
  }
}
