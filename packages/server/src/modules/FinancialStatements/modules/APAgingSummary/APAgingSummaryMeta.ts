import { Injectable } from '@nestjs/common';
import {
  IAgingSummaryMeta,
  IAgingSummaryQuery,
} from '../AgingSummary/AgingSummary.types';
import { AgingSummaryMeta } from '../AgingSummary/AgingSummaryMeta';

@Injectable()
export class APAgingSummaryMeta {
  constructor(private readonly agingSummaryMeta: AgingSummaryMeta) {}

  /**
   * Retrieve the aging summary meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(query);

    return {
      ...commonMeta,
      sheetName: 'A/P Aging Summary',
    };
  }
}
