import { Exportable } from '../Export/Exportable';
import { ExpensesApplication } from './ExpensesApplication.service';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';
import { Injectable } from '@nestjs/common';
import { IExpensesFilter } from './Expenses.types';
import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { Expense } from './models/Expense.model';

@Injectable()
@ExportableService({ name: Expense.name })
export class ExpensesExportable extends Exportable {
  constructor(
    private readonly expensesApplication: ExpensesApplication,
  ) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {IExpensesFilter}
   */
  public exportable(query: IExpensesFilter) {
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
      .getExpenses(parsedQuery)
      .then((output) => output.expenses);
  }
}
