import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BudgetVsActualService } from './BudgetVsActualService';
import { BudgetVsActualTable } from './BudgetVsActualTable';
import {
  IBudgetVsActualQuery,
  IBudgetVsActualTable,
} from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualTableInjectable {
  constructor(
    private readonly budgetVsActualService: BudgetVsActualService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the budget vs actual report in table format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<IBudgetVsActualTable>}
   */
  public async table(
    query: IBudgetVsActualQuery,
  ): Promise<IBudgetVsActualTable> {
    const budgetVsActual =
      await this.budgetVsActualService.budgetVsActual(query);
    const table = new BudgetVsActualTable(
      budgetVsActual.data,
      budgetVsActual.query,
      this.i18n,
    );
    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableData(),
      },
      query: budgetVsActual.query,
      meta: budgetVsActual.meta,
    };
  }
}
