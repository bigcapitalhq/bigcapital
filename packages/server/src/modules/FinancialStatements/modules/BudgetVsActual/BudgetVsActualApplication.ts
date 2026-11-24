import { Injectable } from '@nestjs/common';
import { BudgetVsActualExportInjectable } from './BudgetVsActualExportInjectable';
import { BudgetVsActualPdfInjectable } from './BudgetVsActualPdfInjectable';
import { BudgetVsActualService } from './BudgetVsActualService';
import { BudgetVsActualTableInjectable } from './BudgetVsActualTableInjectable';
import {
  IBudgetVsActualQuery,
  IBudgetVsActualResponse,
  IBudgetVsActualTable,
} from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualApplication {
  constructor(
    private readonly budgetVsActualService: BudgetVsActualService,
    private readonly budgetVsActualTable: BudgetVsActualTableInjectable,
    private readonly budgetVsActualExport: BudgetVsActualExportInjectable,
    private readonly budgetVsActualPdf: BudgetVsActualPdfInjectable,
  ) {}

  /**
   * Retrieves the budget vs actual report.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<IBudgetVsActualResponse>}
   */
  public sheet(query: IBudgetVsActualQuery): Promise<IBudgetVsActualResponse> {
    return this.budgetVsActualService.budgetVsActual(query);
  }

  /**
   * Retrieves the budget vs actual report in table format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<IBudgetVsActualTable>}
   */
  public table(query: IBudgetVsActualQuery): Promise<IBudgetVsActualTable> {
    return this.budgetVsActualTable.table(query);
  }

  /**
   * Retrieves the budget vs actual report in csv format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<string>}
   */
  public csv(query: IBudgetVsActualQuery): Promise<string> {
    return this.budgetVsActualExport.csv(query);
  }

  /**
   * Retrieves the budget vs actual report in xlsx format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IBudgetVsActualQuery): Promise<Buffer> {
    return this.budgetVsActualExport.xlsx(query);
  }

  /**
   * Retrieves the budget vs actual report in pdf format.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IBudgetVsActualQuery): Promise<Buffer> {
    return this.budgetVsActualPdf.pdf(query);
  }
}
