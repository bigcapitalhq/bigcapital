import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IBillsFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { BillsApplication } from './BillsApplication';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';
import Objection from 'objection';

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
    const filterQuery = (query) => {
      query.withGraphFetched('branch');
      query.withGraphFetched('warehouse');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery,
    } as IBillsFilter;

    return this.billsApplication
      .getBills(tenantId, parsedQuery)
      .then((output) => output.bills);
  }
}
