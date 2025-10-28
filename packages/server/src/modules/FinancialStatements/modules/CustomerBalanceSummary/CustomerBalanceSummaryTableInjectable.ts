import { CustomerBalanceSummaryService } from './CustomerBalanceSummaryService';
import {
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryTable,
} from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryTable } from './CustomerBalanceSummaryTableRows';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CustomerBalanceSummaryTableInjectable {
  constructor(
    private readonly customerBalanceSummaryService: CustomerBalanceSummaryService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the customer balance sheet in table format.
   * @param {ICustomerBalanceSummaryQuery} filter - The customer balance summary query.
   * @returns {Promise<ICustomerBalanceSummaryTable>}
   */
  public async table(
    filter: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryTable> {
    const { data, query, meta } =
      await this.customerBalanceSummaryService.customerBalanceSummary(filter);
    const table = new CustomerBalanceSummaryTable(data, filter, this.i18n);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query,
      meta,
    };
  }
}
