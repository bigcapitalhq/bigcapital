import { Inject, Service } from 'typedi';
import { Exportable } from '../Export/Exportable';
import { IExpensesFilter } from '@/interfaces';
import { ExpensesApplication } from './ExpensesApplication';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';

@Service()
export class ExpensesExportable extends Exportable {
  @Inject()
  private expensesApplication: ExpensesApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IExpensesFilter) {
    const filterQuery = (query) => {
      query.withGraphFetched('branch');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery,
    } as IExpensesFilter;

    return this.expensesApplication
      .getExpenses(tenantId, parsedQuery)
      .then((output) => output.expenses);
  }
}
