import { Knex } from 'knex';
import { BillsApplication } from '../Bills.application';
import { Injectable } from '@nestjs/common';
import { Exportable } from '@/modules/Export/Exportable';
import { IBillsFilter } from '../Bills.types';
import { EXPORT_SIZE_LIMIT } from '@/modules/Export/constants';

@Injectable()
export class BillsExportable extends Exportable {
  constructor(private readonly billsApplication: BillsApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   */
  public exportable(query: IBillsFilter) {
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
      .getBills(parsedQuery)
      .then((output) => output.bills);
  }
}
