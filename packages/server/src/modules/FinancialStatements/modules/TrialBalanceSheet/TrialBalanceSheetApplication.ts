import { Injectable } from '@nestjs/common';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { TrialBalanceExportInjectable } from './TrialBalanceExportInjectable';
import { ITrialBalanceStatement } from './TrialBalanceSheet.types';
import { TrialBalanceSheetService } from './TrialBalanceSheetInjectable';
import { TrialBalanceSheetQueryDto } from './TrialBalanceSheetQuery.dto';

@Injectable()
export class TrialBalanceSheetApplication {
  /**
   * @param {TrialBalanceSheetService} sheetService - The trial balance sheet service.
   * @param {TrialBalanceSheetTableInjectable} tablable - The trial balance sheet table injectable.
   * @param {TrialBalanceExportInjectable} exportable - The trial balance export injectable.
   */
  constructor(
    private readonly sheetService: TrialBalanceSheetService,
    private readonly tablable: TrialBalanceSheetTableInjectable,
    private readonly exportable: TrialBalanceExportInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet.
   * @param {TrialBalanceSheetQueryDto} query
   * @returns {Promise<ITrialBalanceStatement>}
   */
  public sheet(
    query: TrialBalanceSheetQueryDto,
  ): Promise<ITrialBalanceStatement> {
    return this.sheetService.trialBalanceSheet(query);
  }

  /**
   * Retrieves the trial balance sheet in table format.
   * @param {TrialBalanceSheetQueryDto} query
   * @returns {Promise<ITrialBalanceSheetTable>}
   */
  public table(query: TrialBalanceSheetQueryDto) {
    return this.tablable.table(query);
  }

  /**
   * Retrieve the trial balance sheet in CSV format.
   * @param {TrialBalanceSheetQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public csv(query: TrialBalanceSheetQueryDto) {
    return this.exportable.csv(query);
  }

  /**
   * Retrieve the trial balance sheet in XLSX format.
   * @param {TrialBalanceSheetQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: TrialBalanceSheetQueryDto) {
    return this.exportable.xlsx(query);
  }

  /**
   * Retrieve the trial balance sheet in pdf format.
   * @param {TrialBalanceSheetQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: TrialBalanceSheetQueryDto) {
    return this.exportable.pdf(query);
  }
}
