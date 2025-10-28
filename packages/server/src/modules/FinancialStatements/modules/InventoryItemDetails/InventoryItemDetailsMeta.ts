import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import {
  IInventoryDetailsQuery,
  IInventoryItemDetailMeta,
} from './InventoryItemDetails.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class InventoryDetailsMetaInjectable {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the inventoy details meta.
   * @returns {IInventoryItemDetailMeta}
   */
  public async meta(
    query: IInventoryDetailsQuery,
  ): Promise<IInventoryItemDetailMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedToDay = moment(query.toDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDay}`;

    const sheetName = 'Inventory Item Details';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDay,
      formattedDateRange,
    };
  }
}
