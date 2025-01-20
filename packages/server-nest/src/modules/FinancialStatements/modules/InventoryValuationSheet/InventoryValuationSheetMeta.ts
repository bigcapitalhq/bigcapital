import * as moment from 'moment';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  IInventoryValuationSheetMeta,
  IInventoryValuationReportQuery,
} from './InventoryValuationSheet.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryValuationMetaInjectable {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the balance sheet meta.
   * @returns {Promise<IInventoryValuationSheetMeta>}
   */
  public async meta(
    query: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: 'Inventory Valuation Sheet',
      formattedAsDate,
      formattedDateRange,
    };
  }
}
