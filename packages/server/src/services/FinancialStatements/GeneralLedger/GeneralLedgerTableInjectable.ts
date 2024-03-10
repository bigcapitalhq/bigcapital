import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerTableData,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { GeneralLedgerService } from './GeneralLedgerService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GeneralLedgerTable } from './GeneralLedgerTable';

@Service()
export class GeneralLedgerTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private GLSheet: GeneralLedgerService;

  /**
   * Retrieves the G/L table.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<IGeneralLedgerTableData>}
   */
  public async table(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<IGeneralLedgerTableData> {
    const {
      data: sheetData,
      query: sheetQuery,
      meta: sheetMeta,
    } = await this.GLSheet.generalLedger(tenantId, query);

    const table = new GeneralLedgerTable(sheetData, sheetQuery, sheetMeta);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query: sheetQuery,
      meta: sheetMeta,
    };
  }
}
