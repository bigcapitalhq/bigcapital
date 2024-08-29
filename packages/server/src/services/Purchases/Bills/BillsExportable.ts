import { Inject, Service } from 'typedi';
import { IBillsFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { BillsApplication } from './BillsApplication';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';

@Service()
export class BillsExportable extends Exportable {
  @Inject()
  private billsApplication: BillsApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IBillsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IBillsFilter;

    return this.billsApplication
      .getBills(tenantId, parsedQuery)
      .then((output) => output.bills);
  }
}
